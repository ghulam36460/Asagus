import { Router, Request, Response } from "express";
import { prisma } from "@asagus/database";
import { authenticate } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all team members
router.get("/", async (req: Request, res: Response) => {
  try {
    const { department, isActive, featured } = req.query;

    const where: any = {};
    if (department) where.department = department as string;
    if (isActive !== undefined) where.isActive = isActive === "true";
    if (featured !== undefined) where.featured = featured === "true";

    const teamMembers = await prisma.teamMember.findMany({
      where,
      orderBy: [{ orderIndex: "asc" }, { name: "asc" }],
    });

    res.json({ success: true, data: teamMembers });
  } catch (error) {
    console.error("[Team] Get all error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch team members" });
  }
});

// Get single team member by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!teamMember) {
      return res.status(404).json({ success: false, error: "Team member not found" });
    }

    res.json({ success: true, data: teamMember });
  } catch (error) {
    console.error("[Team] Get by ID error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch team member" });
  }
});

// Get team member by slug
router.get("/slug/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const teamMember = await prisma.teamMember.findUnique({
      where: { slug },
    });

    if (!teamMember) {
      return res.status(404).json({ success: false, error: "Team member not found" });
    }

    res.json({ success: true, data: teamMember });
  } catch (error) {
    console.error("[Team] Get by slug error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch team member" });
  }
});

// Create team member
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      name,
      slug,
      role,
      department,
      bio,
      expertise,
      avatarUrl,
      email,
      phone,
      linkedinUrl,
      twitterUrl,
      githubUrl,
      websiteUrl,
      isActive,
      featured,
      orderIndex,
      joinedAt,
    } = req.body;

    // Validate required fields
    if (!name || !slug || !role) {
      return res.status(400).json({
        success: false,
        error: "Name, slug, and role are required",
      });
    }

    // Check if slug already exists
    const existing = await prisma.teamMember.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ success: false, error: "Slug already exists" });
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        slug,
        role,
        department,
        bio,
        expertise: expertise || [],
        avatarUrl,
        email,
        phone,
        linkedinUrl,
        twitterUrl,
        githubUrl,
        websiteUrl,
        isActive: isActive ?? true,
        featured: featured ?? false,
        orderIndex: orderIndex ?? 0,
        joinedAt: joinedAt ? new Date(joinedAt) : null,
      },
    });

    res.status(201).json({ success: true, data: teamMember });
  } catch (error) {
    console.error("[Team] Create error:", error);
    res.status(500).json({ success: false, error: "Failed to create team member" });
  }
});

// Update team member
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      role,
      department,
      bio,
      expertise,
      avatarUrl,
      email,
      phone,
      linkedinUrl,
      twitterUrl,
      githubUrl,
      websiteUrl,
      isActive,
      featured,
      orderIndex,
      joinedAt,
    } = req.body;

    // Check if team member exists
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: "Team member not found" });
    }

    // If slug is being changed, check for conflicts
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.teamMember.findUnique({ where: { slug } });
      if (slugExists) {
        return res.status(400).json({ success: false, error: "Slug already exists" });
      }
    }

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(role && { role }),
        ...(department !== undefined && { department }),
        ...(bio !== undefined && { bio }),
        ...(expertise !== undefined && { expertise }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(twitterUrl !== undefined && { twitterUrl }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(websiteUrl !== undefined && { websiteUrl }),
        ...(isActive !== undefined && { isActive }),
        ...(featured !== undefined && { featured }),
        ...(orderIndex !== undefined && { orderIndex }),
        ...(joinedAt !== undefined && { joinedAt: joinedAt ? new Date(joinedAt) : null }),
      },
    });

    res.json({ success: true, data: teamMember });
  } catch (error) {
    console.error("[Team] Update error:", error);
    res.status(500).json({ success: false, error: "Failed to update team member" });
  }
});

// Delete team member
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: "Team member not found" });
    }

    await prisma.teamMember.delete({ where: { id } });

    res.json({ success: true, message: "Team member deleted successfully" });
  } catch (error) {
    console.error("[Team] Delete error:", error);
    res.status(500).json({ success: false, error: "Failed to delete team member" });
  }
});

// Reorder team members
router.post("/reorder", async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // Array of { id, orderIndex }

    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, error: "Items must be an array" });
    }

    // Update all items in a transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.teamMember.update({
          where: { id: item.id },
          data: { orderIndex: item.orderIndex },
        })
      )
    );

    res.json({ success: true, message: "Team members reordered successfully" });
  } catch (error) {
    console.error("[Team] Reorder error:", error);
    res.status(500).json({ success: false, error: "Failed to reorder team members" });
  }
});

export default router;
