import { Router } from "express";
import { prisma } from "@asagus/database";
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
// PUBLIC: List all technologies
// ============================================
router.get("/", async (req, res) => {
  try {
    const category = req.query.category as string;
    const search = req.query.search as string;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const technologies = await prisma.technology.findMany({
      where: where as any,
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    res.json({
      success: true,
      data: technologies,
    });
  } catch (error) {
    console.error("[Content] List technologies error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ============================================
// PUBLIC: Get single technology
// ============================================
router.get("/:slug", async (req, res) => {
  try {
    const technology = await prisma.technology.findUnique({
      where: { slug: req.params.slug },
    });

    if (!technology) {
      res.status(404).json({ success: false, error: "Technology not found" });
      return;
    }

    res.json({ success: true, data: technology });
  } catch (error) {
    console.error("[Content] Get technology error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ============================================
// ADMIN: Create technology
// ============================================
router.post("/", authenticate, authorize("projects:create"), async (req: AuthRequest, res: Response) => {
  try {
    const { name, icon, iconType, color, category, description } = req.body;

    if (!name) {
      res.status(400).json({ success: false, error: "Name is required" });
      return;
    }

    const slug = slugify(name);

    // Check slug uniqueness
    const existing = await prisma.technology.findUnique({ where: { slug } });
    if (existing) {
      res.status(409).json({ success: false, error: "Technology already exists" });
      return;
    }

    const technology = await prisma.technology.create({
      data: {
        name,
        slug,
        icon,
        iconType: iconType || "devicon",
        color,
        category,
        description,
      },
    });

    res.status(201).json({ success: true, data: technology });
  } catch (error) {
    console.error("[Content] Create technology error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ============================================
// ADMIN: Update technology
// ============================================
router.put("/:id", authenticate, authorize("projects:update"), async (req: AuthRequest, res: Response) => {
  try {
    const { name, icon, iconType, color, category, description } = req.body;
    
    const updateData: any = {};
    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = slugify(name);
    }
    if (icon !== undefined) updateData.icon = icon;
    if (iconType !== undefined) updateData.iconType = iconType;
    if (color !== undefined) updateData.color = color;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;

    const technology = await prisma.technology.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json({ success: true, data: technology });
  } catch (error) {
    console.error("[Content] Update technology error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ============================================
// ADMIN: Delete technology
// ============================================
router.delete("/:id", authenticate, authorize("projects:delete"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.technology.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: { message: "Technology deleted" } });
  } catch (error) {
    console.error("[Content] Delete technology error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export { router as technologiesRouter };
