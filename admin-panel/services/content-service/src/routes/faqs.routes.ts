import { Router, Response } from "express";
import { prisma } from "@asagus/database";
import { faqSchema } from "@asagus/shared";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";

const router = Router();

// List FAQs
router.get("/", async (req, res) => {
  try {
    const category = req.query.category as string;
    const isActive = req.query.active === "true" ? true : undefined;
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive;

    const faqs = await prisma.fAQ.findMany({
      where: where as any,
      orderBy: { orderIndex: "asc" },
    });
    res.json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Get single FAQ
router.get("/:id", async (req, res) => {
  try {
    const faq = await prisma.fAQ.findUnique({ where: { id: req.params.id } });
    if (!faq) {
      res.status(404).json({ success: false, error: "FAQ not found" });
      return;
    }
    // Increment view count
    await prisma.fAQ.update({ where: { id: faq.id }, data: { viewCount: { increment: 1 } } });
    res.json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Create FAQ
router.post("/", authenticate, authorize("faqs:create"), async (req: AuthRequest, res: Response) => {
  try {
    const parsed = faqSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      return;
    }
    const faq = await prisma.fAQ.create({ data: parsed.data });
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Update FAQ
router.put("/:id", authenticate, authorize("faqs:update"), async (req: AuthRequest, res: Response) => {
  try {
    const faq = await prisma.fAQ.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Delete FAQ
router.delete("/:id", authenticate, authorize("faqs:delete"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.fAQ.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: { message: "FAQ deleted" } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Reorder FAQs
router.patch("/reorder", authenticate, authorize("faqs:update"), async (req: AuthRequest, res: Response) => {
  try {
    const { faqs } = req.body as { faqs: { id: string; orderIndex: number }[] };
    await Promise.all(
      faqs.map((f) => prisma.fAQ.update({ where: { id: f.id }, data: { orderIndex: f.orderIndex } }))
    );
    res.json({ success: true, data: { message: "FAQs reordered" } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Mark FAQ as helpful
router.post("/:id/helpful", async (req, res) => {
  try {
    const faq = await prisma.fAQ.update({
      where: { id: req.params.id },
      data: { helpful: { increment: 1 } },
    });
    res.json({ success: true, data: { helpful: faq.helpful } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export { router as faqsRouter };
