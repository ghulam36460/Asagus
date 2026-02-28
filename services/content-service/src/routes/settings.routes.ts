import { Router, Response } from "express";
import { prisma } from "@asagus/database";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";

const router = Router();

// Get all settings (grouped)
router.get("/", authenticate, authorize("settings:read"), async (req: AuthRequest, res: Response) => {
  try {
    const group = req.query.group as string;
    const where = group ? { group } : {};

    const settings = await prisma.setting.findMany({
      where,
      orderBy: { key: "asc" },
    });

    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Get single setting
router.get("/:key", authenticate, authorize("settings:read"), async (req: AuthRequest, res: Response) => {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: req.params.key } });
    if (!setting) {
      res.status(404).json({ success: false, error: "Setting not found" });
      return;
    }
    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Update setting
router.put("/:key", authenticate, authorize("settings:update"), async (req: AuthRequest, res: Response) => {
  try {
    const { value } = req.body;
    const setting = await prisma.setting.upsert({
      where: { key: req.params.key },
      update: { value },
      create: { key: req.params.key, value, ...req.body },
    });
    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Bulk update settings
router.put("/", authenticate, authorize("settings:update"), async (req: AuthRequest, res: Response) => {
  try {
    const { settings } = req.body as { settings: { key: string; value: unknown }[] };
    await Promise.all(
      settings.map((s) =>
        prisma.setting.update({ where: { key: s.key }, data: { value: s.value as any } })
      )
    );
    res.json({ success: true, data: { message: "Settings updated" } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export { router as settingsRouter };
