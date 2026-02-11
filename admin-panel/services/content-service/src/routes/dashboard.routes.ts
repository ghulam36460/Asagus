import { Router, Response } from "express";
import { prisma } from "@asagus/database";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

// Dashboard stats
router.get("/stats", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalProjects,
      publishedProjects,
      totalServices,
      totalTestimonials,
      totalContacts,
      unreadContacts,
      totalSubscribers,
      totalPageViews,
      recentContacts,
      recentProjects,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.service.count({ where: { isActive: true } }),
      prisma.testimonial.count({ where: { isActive: true } }),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { isRead: false } }),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
      prisma.pageView.count(),
      prisma.contactSubmission.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          published: true,
          viewCount: true,
          createdAt: true,
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalProjects,
        publishedProjects,
        totalServices,
        totalTestimonials,
        totalContacts,
        unreadContacts,
        totalSubscribers,
        totalPageViews,
        recentContacts,
        recentProjects,
      },
    });
  } catch (error) {
    console.error("[Content] Dashboard stats error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export { router as dashboardRouter };
