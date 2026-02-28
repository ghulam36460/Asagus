import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "@asagus/database";
import jwt from "jsonwebtoken";

const router = Router();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

if (!ACCESS_SECRET) {
  console.warn("⚠️  WARNING: JWT_ACCESS_SECRET not set in analytics-service! Auth will fail.");
}

interface AuthRequest extends Request {
  user?: { id: string; roles: string[]; permissions: string[] };
}

// Simple auth middleware for analytics
function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ") && ACCESS_SECRET) {
    try {
      const decoded = jwt.verify(authHeader.split(" ")[1], ACCESS_SECRET) as { sub: string; roles: string[]; permissions: string[] };
      req.user = { id: decoded.sub, roles: decoded.roles, permissions: decoded.permissions };
    } catch {
      // Token invalid, continue without auth
    }
  }
  next();
}

function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Authentication required" });
    return;
  }
  if (!ACCESS_SECRET) {
    res.status(500).json({ success: false, error: "Server misconfiguration" });
    return;
  }
  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], ACCESS_SECRET) as { sub: string; roles: string[]; permissions: string[] };
    req.user = { id: decoded.sub, roles: decoded.roles, permissions: decoded.permissions };
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
}

// ============================================
// PUBLIC: Track page view (from main website)
// ============================================
router.post("/pageview", async (req: Request, res: Response) => {
  try {
    const { path: pagePath, referrer, sessionId } = req.body;

    // Basic input validation
    if (!pagePath || typeof pagePath !== "string" || pagePath.length > 2048) {
      res.status(400).json({ success: false, error: "Invalid path" });
      return;
    }

    await prisma.pageView.create({
      data: {
        path: pagePath.slice(0, 2048),
        referrer: typeof referrer === "string" ? referrer.slice(0, 2048) : null,
        userAgent: req.headers["user-agent"]?.slice(0, 512),
        ipAddress: req.ip,
        sessionId: typeof sessionId === "string" ? sessionId.slice(0, 128) : undefined,
        device: detectDevice(req.headers["user-agent"] || ""),
        browser: detectBrowser(req.headers["user-agent"] || ""),
      },
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("[Analytics] Track pageview error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ============================================
// PUBLIC: Track event
// ============================================
router.post("/event", async (req: Request, res: Response) => {
  try {
    const { name, category, label, value, metadata, sessionId } = req.body;

    // Basic input validation
    if (!name || typeof name !== "string" || name.length > 256) {
      res.status(400).json({ success: false, error: "Invalid event name" });
      return;
    }

    await prisma.analyticsEvent.create({
      data: {
        name: name.slice(0, 256),
        category: typeof category === "string" ? category.slice(0, 256) : undefined,
        label: typeof label === "string" ? label.slice(0, 256) : undefined,
        value: typeof value === "number" ? value : undefined,
        metadata: metadata && typeof metadata === "object" ? metadata : undefined,
        sessionId: typeof sessionId === "string" ? sessionId.slice(0, 128) : undefined,
        ipAddress: req.ip,
      },
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("[Analytics] Track event error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ============================================
// ADMIN: Get overview stats
// ============================================
router.get("/overview", requireAuth, async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [
      totalViews,
      periodViews,
      topPages,
      deviceBreakdown,
      browserBreakdown,
      totalEvents,
      recentEvents,
    ] = await Promise.all([
      prisma.pageView.count(),
      prisma.pageView.count({ where: { createdAt: { gte: since } } }),
      prisma.$queryRawUnsafe<{ path: string; count: bigint }[]>(
        `SELECT path, COUNT(*) as count FROM page_views WHERE created_at >= $1 GROUP BY path ORDER BY count DESC LIMIT 10`,
        since
      ),
      prisma.$queryRawUnsafe<{ device: string; count: bigint }[]>(
        `SELECT COALESCE(device, 'unknown') as device, COUNT(*) as count FROM page_views WHERE created_at >= $1 GROUP BY device ORDER BY count DESC`,
        since
      ),
      prisma.$queryRawUnsafe<{ browser: string; count: bigint }[]>(
        `SELECT COALESCE(browser, 'unknown') as browser, COUNT(*) as count FROM page_views WHERE created_at >= $1 GROUP BY browser ORDER BY count DESC LIMIT 5`,
        since
      ),
      prisma.analyticsEvent.count({ where: { createdAt: { gte: since } } }),
      prisma.analyticsEvent.findMany({
        where: { createdAt: { gte: since } },
        take: 20,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Daily views for chart
    const dailyViews = await prisma.$queryRawUnsafe<{ date: string; count: bigint }[]>(
      `SELECT DATE(created_at) as date, COUNT(*) as count FROM page_views WHERE created_at >= $1 GROUP BY DATE(created_at) ORDER BY date ASC`,
      since
    );

    res.json({
      success: true,
      data: {
        totalViews,
        periodViews,
        topPages: topPages.map((p) => ({ path: p.path, count: Number(p.count) })),
        deviceBreakdown: deviceBreakdown.map((d) => ({ device: d.device, count: Number(d.count) })),
        browserBreakdown: browserBreakdown.map((b) => ({ browser: b.browser, count: Number(b.count) })),
        totalEvents,
        recentEvents,
        dailyViews: dailyViews.map((d) => ({ date: d.date, count: Number(d.count) })),
      },
    });
  } catch (error) {
    console.error("[Analytics] Overview error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ============================================
// ADMIN: Get audit logs
// ============================================
router.get("/audit-logs", requireAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const action = req.query.action as string;

    const where: Record<string, unknown> = {};
    if (action) where.action = action;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: where as any,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.auditLog.count({ where: where as any }),
    ]);

    res.json({
      success: true,
      data: logs.map((l) => ({ ...l, id: l.id.toString() })),
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[Analytics] Audit logs error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ============================================
// Helpers
// ============================================
function detectDevice(ua: string): string {
  if (/mobile/i.test(ua)) return "mobile";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  return "desktop";
}

function detectBrowser(ua: string): string {
  if (/chrome/i.test(ua) && !/edge/i.test(ua)) return "Chrome";
  if (/firefox/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  if (/edge/i.test(ua)) return "Edge";
  if (/opera|opr/i.test(ua)) return "Opera";
  return "Other";
}

export { router as analyticsRouter };
