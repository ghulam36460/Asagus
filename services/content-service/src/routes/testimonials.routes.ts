import { Router, Response } from "express";
import { prisma } from "@asagus/database";
import { testimonialSchema } from "@asagus/shared";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";

const router = Router();

// List testimonials
router.get("/", async (req, res) => {
  try {
    const featured = req.query.featured === "true" ? true : undefined;
    const isActive = req.query.active === "true" ? true : undefined;
    const where: Record<string, unknown> = {};
    if (featured !== undefined) where.featured = featured;
    if (isActive !== undefined) where.isActive = isActive;

    const testimonials = await prisma.testimonial.findMany({
      where: where as any,
      orderBy: { orderIndex: "asc" },
    });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Get single testimonial
router.get("/:id", async (req, res) => {
  try {
    const testimonial = await prisma.testimonial.findUnique({ where: { id: req.params.id } });
    if (!testimonial) {
      res.status(404).json({ success: false, error: "Testimonial not found" });
      return;
    }
    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Create testimonial
router.post("/", authenticate, authorize("testimonials:create"), async (req: AuthRequest, res: Response) => {
  try {
    const parsed = testimonialSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      return;
    }
    const testimonial = await prisma.testimonial.create({ data: parsed.data });
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Update testimonial
router.put("/:id", authenticate, authorize("testimonials:update"), async (req: AuthRequest, res: Response) => {
  try {
    const testimonial = await prisma.testimonial.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Delete testimonial
router.delete("/:id", authenticate, authorize("testimonials:delete"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: { message: "Testimonial deleted" } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Approve testimonial
router.patch("/:id/approve", authenticate, authorize("testimonials:update"), async (req: AuthRequest, res: Response) => {
  try {
    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data: { approved: true },
    });
    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export { router as testimonialsRouter };
