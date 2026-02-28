"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, Loader2, Eye, Calendar, Tag } from "lucide-react";
import { DataTable, Column } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";

type AnyRecord = Record<string, any>;

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  authorId?: string;
  authorName: string;
  category: string;
  tags: string[];
  status: string;
  publishedAt?: string;
  featured: boolean;
  viewCount: number;
  readTime?: number;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  "Technology",
  "AI & Machine Learning",
  "Cybersecurity",
  "Web Development",
  "Mobile Development",
  "Cloud Computing",
  "DevOps",
  "Blockchain",
  "Product Management",
  "Business",
];

const statuses = [
  { value: "draft", label: "Draft", color: "bg-yellow-100 text-yellow-700" },
  { value: "published", label: "Published", color: "bg-green-100 text-green-700" },
  { value: "archived", label: "Archived", color: "bg-gray-100 text-gray-700" },
];

export default function BlogManagementPage() {
  const { toast } = useToast();
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<BlogPost | null>(null);
  const [formData, setFormData] = React.useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    authorName: "",
    category: "",
    tags: [] as string[],
    status: "draft",
    publishedAt: "",
    featured: false,
    readTime: 0,
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
  });
  const [saving, setSaving] = React.useState(false);
  const [tagInput, setTagInput] = React.useState("");

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/content/blog");
      setPosts(response.data || []);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      authorName: "",
      category: "",
      tags: [],
      status: "draft",
      publishedAt: "",
      featured: false,
      readTime: 0,
      metaTitle: "",
      metaDescription: "",
      ogImage: "",
    });
    setTagInput("");
    setModalOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      featuredImage: post.featuredImage || "",
      authorName: post.authorName,
      category: post.category,
      tags: post.tags || [],
      status: post.status,
      publishedAt: post.publishedAt || "",
      featured: post.featured,
      readTime: post.readTime || 0,
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      ogImage: post.ogImage || "",
    });
    setTagInput("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.content || !formData.authorName || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Title, slug, content, author name, and category are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const dataToSend = {
        ...formData,
        readTime: formData.readTime || null,
        publishedAt: formData.publishedAt || null,
      };

      if (editingPost) {
        await api.put(`/content/blog/${editingPost.id}`, dataToSend);
        toast({
          title: "Success",
          description: "Blog post updated successfully",
          variant: "success",
        });
      } else {
        await api.post("/content/blog", dataToSend);
        toast({
          title: "Success",
          description: "Blog post created successfully",
          variant: "success",
        });
      }
      setModalOpen(false);
      fetchPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to save blog post",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      await api.del(`/content/blog/${id}`);
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
        variant: "success",
      });
      fetchPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  const handlePublishToggle = async (post: BlogPost) => {
    try {
      const newStatus = post.status === "published" ? "draft" : "published";
      await api.post(`/content/blog/${post.id}/publish`, {
        publish: newStatus === "published",
      });
      toast({
        title: "Success",
        description: `Blog post ${newStatus === "published" ? "published" : "unpublished"} successfully`,
        variant: "success",
      });
      fetchPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update blog post status",
        variant: "destructive",
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  React.useEffect(() => {
    if (formData.content) {
      const readTime = estimateReadTime(formData.content);
      setFormData((prev) => ({ ...prev, readTime }));
    }
  }, [formData.content]);

  const columns: Column<AnyRecord>[] = [
    {
      key: "featuredImage",
      header: "Image",
      render: (r: AnyRecord) => (
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
          {r.featuredImage ? (
            <img src={r.featuredImage as string} alt={r.title as string} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Eye size={20} />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      header: "Title",
      render: (r: AnyRecord) => (
        <div>
          <div className="font-medium">{r.title as string}</div>
          <div className="text-xs text-muted-foreground">{r.authorName as string}</div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (r: AnyRecord) => (
        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">{r.category as string}</span>
      ),
    },
    {
      key: "tags",
      header: "Tags",
      render: (r: AnyRecord) => (
        <div className="flex flex-wrap gap-1">
          {(r.tags as string[])?.slice(0, 2).map((tag: string, i: number) => (
            <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
              {tag}
            </span>
          ))}
          {(r.tags as string[])?.length > 2 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
              +{(r.tags as string[]).length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r: AnyRecord) => {
        const statusConfig = statuses.find((s) => s.value === r.status);
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig?.color || "bg-gray-100 text-gray-700"}`}>
            {statusConfig?.label || r.status}
          </span>
        );
      },
    },
    {
      key: "featured",
      header: "Featured",
      render: (r: AnyRecord) => (
        <span className={r.featured ? "text-yellow-500 text-lg" : "text-gray-300"}>
          {r.featured ? "★" : "☆"}
        </span>
      ),
    },
    {
      key: "viewCount",
      header: "Views",
      render: (r: AnyRecord) => (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Eye size={14} />
          {r.viewCount || 0}
        </div>
      ),
    },
    {
      key: "publishedAt",
      header: "Published",
      render: (r: AnyRecord) => (
        <div className="text-sm text-muted-foreground">
          {r.publishedAt ? formatDate(r.publishedAt as string) : "—"}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (r: AnyRecord) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePublishToggle(r as unknown as BlogPost)}
            className={`p-1.5 rounded-lg ${r.status === "published" ? "hover:bg-yellow-50 text-yellow-600" : "hover:bg-green-50 text-green-600"}`}
            title={r.status === "published" ? "Unpublish" : "Publish"}
          >
            {r.status === "published" ? <Calendar size={15} /> : <Eye size={15} />}
          </button>
          <button
            onClick={() => openEdit(r as unknown as BlogPost)}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => handleDelete(r.id as string)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage blog posts</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Posts", value: posts.length, color: "bg-blue-500" },
          { label: "Published", value: posts.filter((p) => p.status === "published").length, color: "bg-green-500" },
          { label: "Drafts", value: posts.filter((p) => p.status === "draft").length, color: "bg-yellow-500" },
          { label: "Featured", value: posts.filter((p) => p.featured).length, color: "bg-purple-500" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg opacity-10`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
          <CardDescription>Manage your blog content</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={posts} loading={loading} searchKey="title" />
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Blog Post" : "Create Blog Post"}</DialogTitle>
            <DialogDescription>
              {editingPost ? "Update blog post content" : "Write a new blog post"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Featured Image */}
            <div>
              <Label>Featured Image</Label>
              <ImageUpload
                value={formData.featuredImage}
                onChange={(url) => setFormData({ ...formData, featuredImage: url })}
              />
            </div>

            {/* Title & Slug */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (!editingPost) {
                      setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }));
                    }
                  }}
                  placeholder="Your Amazing Blog Post"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="your-amazing-blog-post"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Input
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A brief summary of your post..."
              />
            </div>

            {/* Content */}
            <div>
              <Label>Content *</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Write your blog post content here..."
              />
              {formData.readTime > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Estimated read time: {formData.readTime} min
                </p>
              )}
            </div>

            {/* Author, Category, Status */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="authorName">Author Name *</Label>
                <Input
                  id="authorName"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add a tag..."
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-blue-900">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* SEO Metadata */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">SEO Metadata</h3>
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="SEO title (defaults to post title)"
                />
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Input
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="SEO description (defaults to excerpt)"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-6 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured Post
                </Label>
              </div>

              {formData.status === "published" && (
                <div>
                  <Label htmlFor="publishedAt">Publish Date</Label>
                  <Input
                    id="publishedAt"
                    type="datetime-local"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingPost ? "Update Post" : "Create Post"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
