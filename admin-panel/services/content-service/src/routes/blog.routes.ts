import { Router, Request, Response } from "express";
import { prisma } from "@asagus/database";
import { authenticate } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all blog posts
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, category, featured } = req.query;

    const where: any = {};
    if (status) where.status = status as string;
    if (category) where.category = category as string;
    if (featured !== undefined) where.featured = featured === "true";

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    res.json({ success: true, data: posts });
  } catch (error) {
    console.error("[Blog] Get all error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch blog posts" });
  }
});

// Get single blog post by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ success: false, error: "Blog post not found" });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    console.error("[Blog] Get by ID error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch blog post" });
  }
});

// Get blog post by slug
router.get("/slug/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      return res.status(404).json({ success: false, error: "Blog post not found" });
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    res.json({ success: true, data: post });
  } catch (error) {
    console.error("[Blog] Get by slug error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch blog post" });
  }
});

// Create blog post
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      authorId,
      authorName,
      category,
      tags,
      status,
      publishedAt,
      featured,
      readTime,
      metaTitle,
      metaDescription,
      ogImage,
    } = req.body;

    // Validate required fields
    if (!title || !slug || !content || !authorName || !category) {
      return res.status(400).json({
        success: false,
        error: "Title, slug, content, authorName, and category are required",
      });
    }

    // Check if slug already exists
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ success: false, error: "Slug already exists" });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        authorId,
        authorName,
        category,
        tags: tags || [],
        status: status || "draft",
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        featured: featured ?? false,
        readTime,
        metaTitle,
        metaDescription,
        ogImage,
      },
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error("[Blog] Create error:", error);
    res.status(500).json({ success: false, error: "Failed to create blog post" });
  }
});

// Update blog post
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      authorId,
      authorName,
      category,
      tags,
      status,
      publishedAt,
      featured,
      readTime,
      metaTitle,
      metaDescription,
      ogImage,
    } = req.body;

    // Check if post exists
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: "Blog post not found" });
    }

    // If slug is being changed, check for conflicts
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.blogPost.findUnique({ where: { slug } });
      if (slugExists) {
        return res.status(400).json({ success: false, error: "Slug already exists" });
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content && { content }),
        ...(featuredImage !== undefined && { featuredImage }),
        ...(authorId !== undefined && { authorId }),
        ...(authorName && { authorName }),
        ...(category && { category }),
        ...(tags !== undefined && { tags }),
        ...(status && { status }),
        ...(publishedAt !== undefined && { publishedAt: publishedAt ? new Date(publishedAt) : null }),
        ...(featured !== undefined && { featured }),
        ...(readTime !== undefined && { readTime }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(ogImage !== undefined && { ogImage }),
      },
    });

    res.json({ success: true, data: post });
  } catch (error) {
    console.error("[Blog] Update error:", error);
    res.status(500).json({ success: false, error: "Failed to update blog post" });
  }
});

// Delete blog post
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: "Blog post not found" });
    }

    await prisma.blogPost.delete({ where: { id } });

    res.json({ success: true, message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("[Blog] Delete error:", error);
    res.status(500).json({ success: false, error: "Failed to delete blog post" });
  }
});

// Publish/unpublish blog post
router.post("/:id/publish", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { publish } = req.body; // true to publish, false to unpublish

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: "Blog post not found" });
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        status: publish ? "published" : "draft",
        publishedAt: publish ? new Date() : null,
      },
    });

    res.json({ success: true, data: post });
  } catch (error) {
    console.error("[Blog] Publish error:", error);
    res.status(500).json({ success: false, error: "Failed to update blog post status" });
  }
});

export default router;
