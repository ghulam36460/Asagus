import { Router } from "express";
import { prisma } from "@asagus/database";
import { projectSchema } from "@asagus/shared";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { Response } from "express";

const router = Router();

// Slugify helper
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ============================================
// PUBLIC: List projects (with filters)
// ============================================
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const category = req.query.category as string;
    const featured = req.query.featured === "true" ? true : req.query.featured === "false" ? false : undefined;
    const published = req.query.published === "true" ? true : req.query.published === "false" ? false : undefined;
    const search = req.query.search as string;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as string) === "asc" ? "asc" : "desc";

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (featured !== undefined) where.featured = featured;
    if (published !== undefined) where.published = published;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: where as any,
        include: { 
          metrics: true, 
          testimonial: true,
          projectTechnologies: {
            include: {
              technology: true
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.project.count({ where: where as any }),
    ]);

    res.json({
      success: true,
      data: projects,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[Content] List projects error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ============================================
// PUBLIC: Get single project
// ============================================
router.get("/:slug", async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug },
      include: { 
        metrics: true, 
        testimonial: true,
        projectTechnologies: {
          include: {
            technology: true
          }
        }
      },
    });

    if (!project) {
      res.status(404).json({ success: false, error: "Project not found" });
      return;
    }

    // Increment view count
    await prisma.project.update({
      where: { id: project.id },
      data: { viewCount: { increment: 1 } },
    });

    res.json({ success: true, data: project });
  } catch (error) {
    console.error("[Content] Get project error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ============================================
// ADMIN: Create project
// ============================================
router.post("/", authenticate, authorize("projects:create"), async (req: AuthRequest, res: Response) => {
  try {
    const { technologyIds, ...projectData } = req.body;
    
    const slug = projectData.slug || slugify(projectData.title);

    // Check slug uniqueness
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      res.status(409).json({ success: false, error: "Slug already exists" });
      return;
    }

    const project = await prisma.project.create({
      data: { ...projectData, slug },
      include: { 
        metrics: true, 
        testimonial: true,
        projectTechnologies: {
          include: {
            technology: true
          }
        }
      },
    });

    // Link technologies if provided
    if (technologyIds && Array.isArray(technologyIds)) {
      for (const techId of technologyIds) {
        await prisma.projectTechnology.create({
          data: {
            projectId: project.id,
            technologyId: techId,
          },
        });
      }
    }

    // Fetch the updated project with technologies
    const updatedProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: {
        metrics: true,
        testimonial: true,
        projectTechnologies: {
          include: {
            technology: true
          }
        }
      },
    });

    res.status(201).json({ success: true, data: updatedProject });
  } catch (error) {
    console.error("[Content] Create project error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ============================================
// ADMIN: Update project
// ============================================
router.put("/:id", authenticate, authorize("projects:update"), async (req: AuthRequest, res: Response) => {
  try {
    const { technologyIds, ...projectData } = req.body;
    
    // Update project
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: projectData,
      include: { 
        metrics: true, 
        testimonial: true,
        projectTechnologies: {
          include: {
            technology: true
          }
        }
      },
    });

    // Update technologies if provided
    if (technologyIds !== undefined && Array.isArray(technologyIds)) {
      // Delete existing relationships
      await prisma.projectTechnology.deleteMany({
        where: { projectId: req.params.id },
      });

      // Create new relationships
      for (const techId of technologyIds) {
        await prisma.projectTechnology.create({
          data: {
            projectId: req.params.id,
            technologyId: techId,
          },
        });
      }

      // Fetch updated project with technologies
      const updatedProject = await prisma.project.findUnique({
        where: { id: req.params.id },
        include: {
          metrics: true,
          testimonial: true,
          projectTechnologies: {
            include: {
              technology: true
            }
          }
        },
      });

      res.json({ success: true, data: updatedProject });
    } else {
      res.json({ success: true, data: project });
    }
  } catch (error) {
    console.error("[Content] Update project error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ============================================
// ADMIN: Delete project
// ============================================
router.delete("/:id", authenticate, authorize("projects:delete"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: { message: "Project deleted" } });
  } catch (error) {
    console.error("[Content] Delete project error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ============================================
// ADMIN: Toggle publish
// ============================================
router.patch("/:id/publish", authenticate, authorize("projects:publish"), async (req: AuthRequest, res: Response) => {
  try {
    const { published } = req.body;
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { published },
    });
    res.json({ success: true, data: project });
  } catch (error) {
    console.error("[Content] Publish project error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export { router as projectsRouter };
