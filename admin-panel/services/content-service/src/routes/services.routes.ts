import { Router, Response } from "express";
import { prisma } from "@asagus/database";
import { serviceSchema } from "@asagus/shared";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";

const router = Router();

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").trim();
}

// List services
router.get("/", async (req, res) => {
  try {
    const isActive = req.query.active === "true" ? true : req.query.active === "false" ? false : undefined;
    const where: Record<string, unknown> = {};
    if (isActive !== undefined) where.isActive = isActive;

    const services = await prisma.service.findMany({
      where: where as any,
      orderBy: { orderIndex: "asc" },
    });
    res.json({ success: true, data: services });
  } catch (error) {
    console.error("[Content] List services error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Get single service
router.get("/:slug", async (req, res) => {
  try {
    const service = await prisma.service.findUnique({ where: { slug: req.params.slug } });
    if (!service) {
      res.status(404).json({ success: false, error: "Service not found" });
      return;
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Create service
router.post("/", authenticate, authorize("services:create"), async (req: AuthRequest, res: Response) => {
  try {
    const parsed = serviceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      return;
    }
    const data = parsed.data;
    const slug = data.slug || slugify(data.title);
    const service = await prisma.service.create({ data: { ...data, slug } });
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    console.error("[Content] Create service error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Update service
router.put("/:id", authenticate, authorize("services:update"), async (req: AuthRequest, res: Response) => {
  try {
    const service = await prisma.service.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Delete service
router.delete("/:id", authenticate, authorize("services:delete"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: { message: "Service deleted" } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Reorder services
router.patch("/reorder", authenticate, authorize("services:update"), async (req: AuthRequest, res: Response) => {
  try {
    const { services } = req.body as { services: { id: string; orderIndex: number }[] };
    await Promise.all(
      services.map((s) =>
        prisma.service.update({ where: { id: s.id }, data: { orderIndex: s.orderIndex } })
      )
    );
    res.json({ success: true, data: { message: "Services reordered" } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export { router as servicesRouter };
