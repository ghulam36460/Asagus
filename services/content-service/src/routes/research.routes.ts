import { Router, Request, Response } from "express";
import { prisma } from "@asagus/database";
import { authenticate } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all research projects
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, category, isPublic, featured } = req.query;

    const where: any = {};
    if (status) where.status = status as string;
    if (category) where.category = category as string;
    if (isPublic !== undefined) where.isPublic = isPublic === "true";
    if (featured !== undefined) where.featured = featured === "true";

    const projects = await prisma.researchProject.findMany({
      where,
      orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
    });

    res.json({ success: true, data: projects });
  } catch (error) {
    console.error("[Research] Get all error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch research projects" });
  }
});

// Get single research project by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const project = await prisma.researchProject.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ success: false, error: "Research project not found" });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    console.error("[Research] Get by ID error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch research project" });
  }
});

// Get research project by slug
router.get("/slug/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const project = await prisma.researchProject.findUnique({
      where: { slug },
    });

    if (!project) {
      return res.status(404).json({ success: false, error: "Research project not found" });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    console.error("[Research] Get by slug error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch research project" });
  }
});

// Create research project
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug,
      description,
      status,
      category,
      technologies,
      teamMembers,
      thumbnailUrl,
      galleryImages,
      objectives,
      methodology,
      results,
      publications,
      startDate,
      endDate,
      isPublic,
      featured,
      orderIndex,
      metaTitle,
      metaDescription,
    } = req.body;

    // Validate required fields
    if (!title || !slug || !description || !category) {
      return res.status(400).json({
        success: false,
        error: "Title, slug, description, and category are required",
      });
    }

    // Check if slug already exists
    const existing = await prisma.researchProject.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ success: false, error: "Slug already exists" });
    }

    const project = await prisma.researchProject.create({
      data: {
        title,
        slug,
        description,
        status: status || "ongoing",
        category,
        technologies: technologies || [],
        teamMembers: teamMembers || [],
        thumbnailUrl,
        galleryImages: galleryImages || [],
        objectives,
        methodology,
        results,
        publications,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isPublic: isPublic ?? false,
        featured: featured ?? false,
        orderIndex: orderIndex ?? 0,
        metaTitle,
        metaDescription,
      },
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error("[Research] Create error:", error);
    res.status(500).json({ success: false, error: "Failed to create research project" });
  }
});

// Update research project
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      description,
      status,
      category,
      technologies,
      teamMembers,
      thumbnailUrl,
      galleryImages,
      objectives,
      methodology,
      results,
      publications,
      startDate,
      endDate,
      isPublic,
      featured,
      orderIndex,
      metaTitle,
      metaDescription,
    } = req.body;

    // Check if project exists
    const existing = await prisma.researchProject.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: "Research project not found" });
    }

    // If slug is being changed, check for conflicts
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.researchProject.findUnique({ where: { slug } });
      if (slugExists) {
        return res.status(400).json({ success: false, error: "Slug already exists" });
      }
    }

    const project = await prisma.researchProject.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(status && { status }),
        ...(category && { category }),
        ...(technologies !== undefined && { technologies }),
        ...(teamMembers !== undefined && { teamMembers }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(galleryImages !== undefined && { galleryImages }),
        ...(objectives !== undefined && { objectives }),
        ...(methodology !== undefined && { methodology }),
        ...(results !== undefined && { results }),
        ...(publications !== undefined && { publications }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(isPublic !== undefined && { isPublic }),
        ...(featured !== undefined && { featured }),
        ...(orderIndex !== undefined && { orderIndex }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
      },
    });

    res.json({ success: true, data: project });
  } catch (error) {
    console.error("[Research] Update error:", error);
    res.status(500).json({ success: false, error: "Failed to update research project" });
  }
});

// Delete research project
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.researchProject.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: "Research project not found" });
    }

    await prisma.researchProject.delete({ where: { id } });

    res.json({ success: true, message: "Research project deleted successfully" });
  } catch (error) {
    console.error("[Research] Delete error:", error);
    res.status(500).json({ success: false, error: "Failed to delete research project" });
  }
});

// Reorder research projects
router.post("/reorder", async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // Array of { id, orderIndex }

    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, error: "Items must be an array" });
    }

    // Update all items in a transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.researchProject.update({
          where: { id: item.id },
          data: { orderIndex: item.orderIndex },
        })
      )
    );

    res.json({ success: true, message: "Research projects reordered successfully" });
  } catch (error) {
    console.error("[Research] Reorder error:", error);
    res.status(500).json({ success: false, error: "Failed to reorder research projects" });
  }
});

export default router;
