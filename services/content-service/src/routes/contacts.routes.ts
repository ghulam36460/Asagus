import { Router, Response } from "express";
import { prisma } from "@asagus/database";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";

const router = Router();

// List contact submissions
router.get("/", authenticate, authorize("contacts:read"), async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const isRead = req.query.read === "true" ? true : req.query.read === "false" ? false : undefined;

    const where: Record<string, unknown> = {};
    if (isRead !== undefined) where.isRead = isRead;

    const [contacts, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where: where as any,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.contactSubmission.count({ where: where as any }),
    ]);

    res.json({
      success: true,
      data: contacts,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Get single contact
router.get("/:id", authenticate, authorize("contacts:read"), async (req: AuthRequest, res: Response) => {
  try {
    const contact = await prisma.contactSubmission.findUnique({ where: { id: req.params.id } });
    if (!contact) {
      res.status(404).json({ success: false, error: "Contact not found" });
      return;
    }

    // Mark as read
    if (!contact.isRead) {
      await prisma.contactSubmission.update({ where: { id: contact.id }, data: { isRead: true } });
    }

    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Reply to contact
router.post("/:id/reply", authenticate, authorize("contacts:update"), async (req: AuthRequest, res: Response) => {
  try {
    const { reply } = req.body;
    if (!reply) {
      res.status(400).json({ success: false, error: "Reply is required" });
      return;
    }

    const contact = await prisma.contactSubmission.update({
      where: { id: req.params.id },
      data: { reply, isReplied: true, repliedAt: new Date(), isRead: true },
    });

    // TODO: Send email reply via Resend

    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Delete contact
router.delete("/:id", authenticate, authorize("contacts:delete"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.contactSubmission.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: { message: "Contact deleted" } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Newsletter subscribers
router.get("/newsletter/subscribers", authenticate, authorize("newsletter:read"), async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { subscribedAt: "desc" },
      }),
      prisma.newsletterSubscriber.count(),
    ]);

    res.json({
      success: true,
      data: subscribers,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export { router as contactsRouter };
