"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2, Calendar, Users } from "lucide-react";
import { DataTable, Column } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageUpload, MultiImageUpload } from "@/components/ui/image-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";

type AnyRecord = Record<string, any>;

interface ResearchProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: string;
  category: string;
  technologies: string[];
  teamMembers: string[];
  thumbnailUrl?: string;
  galleryImages: string[];
  objectives?: string;
  methodology?: string;
  results?: string;
  publications?: any;
  startDate?: string;
  endDate?: string;
  isPublic: boolean;
  featured: boolean;
  orderIndex: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

const projectStatuses = [
  { value: "ongoing", label: "Ongoing", color: "bg-blue-100 text-blue-700" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-700" },
  { value: "paused", label: "Paused", color: "bg-yellow-100 text-yellow-700" },
  { value: "planned", label: "Planned", color: "bg-purple-100 text-purple-700" },
];

const categories = [
  "Artificial Intelligence",
  "Machine Learning",
  "Cybersecurity",
  "Blockchain",
  "Web3",
  "Cloud Computing",
  "IoT",
  "Quantum Computing",
  "Data Science",
  "DevOps",
];

export default function ResearchManagementPage() {
  const { toast } = useToast();
  const [projects, setProjects] = React.useState<ResearchProject[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<ResearchProject | null>(null);
  const [formData, setFormData] = React.useState({
    title: "",
    slug: "",
    description: "",
    status: "ongoing",
    category: "",
    technologies: [] as string[],
    teamMembers: [] as string[],
    thumbnailUrl: "",
    galleryImages: [] as string[],
    objectives: "",
    methodology: "",
    results: "",
    publications: null,
    startDate: "",
    endDate: "",
    isPublic: false,
    featured: false,
    orderIndex: 0,
    metaTitle: "",
    metaDescription: "",
  });
  const [saving, setSaving] = React.useState(false);
  const [techInput, setTechInput] = React.useState("");
  const [memberInput, setMemberInput] = React.useState("");

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get("/content/research");
      setProjects(response.data || []);
    } catch (error) {
      console.error("Failed to fetch research projects:", error);
      toast({
        title: "Error",
        description: "Failed to load research projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      status: "ongoing",
      category: "",
      technologies: [],
      teamMembers: [],
      thumbnailUrl: "",
      galleryImages: [],
      objectives: "",
      methodology: "",
      results: "",
      publications: null,
      startDate: "",
      endDate: "",
      isPublic: false,
      featured: false,
      orderIndex: 0,
      metaTitle: "",
      metaDescription: "",
    });
    setTechInput("");
    setMemberInput("");
    setModalOpen(true);
  };

  const openEdit = (project: ResearchProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description,
      status: project.status,
      category: project.category,
      technologies: project.technologies || [],
      teamMembers: project.teamMembers || [],
      thumbnailUrl: project.thumbnailUrl || "",
      galleryImages: project.galleryImages || [],
      objectives: project.objectives || "",
      methodology: project.methodology || "",
      results: project.results || "",
      publications: project.publications || null,
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      isPublic: project.isPublic,
      featured: project.featured,
      orderIndex: project.orderIndex,
      metaTitle: project.metaTitle || "",
      metaDescription: project.metaDescription || "",
    });
    setTechInput("");
    setMemberInput("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.description || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Title, slug, description, and category are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const dataToSend = {
        ...formData,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };

      if (editingProject) {
        await api.put(`/content/research/${editingProject.id}`, dataToSend);
        toast({
          title: "Success",
          description: "Research project updated successfully",
          variant: "success",
        });
      } else {
        await api.post("/content/research", dataToSend);
        toast({
          title: "Success",
          description: "Research project created successfully",
          variant: "success",
        });
      }
      setModalOpen(false);
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to save research project",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this research project?")) return;

    try {
      await api.del(`/content/research/${id}`);
      toast({
        title: "Success",
        description: "Research project deleted successfully",
        variant: "success",
      });
      fetchProjects();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete research project",
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

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index),
    });
  };

  const addTeamMember = () => {
    if (memberInput.trim() && !formData.teamMembers.includes(memberInput.trim())) {
      setFormData({
        ...formData,
        teamMembers: [...formData.teamMembers, memberInput.trim()],
      });
      setMemberInput("");
    }
  };

  const removeTeamMember = (index: number) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.filter((_, i) => i !== index),
    });
  };

  const columns: Column<AnyRecord>[] = [
    {
      key: "thumbnailUrl",
      header: "Image",
      render: (r: AnyRecord) => (
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
          {r.thumbnailUrl ? (
            <img src={r.thumbnailUrl as string} alt={r.title as string} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600" />
          )}
        </div>
      ),
    },
    { key: "title", header: "Title" },
    {
      key: "category",
      header: "Category",
      render: (r: AnyRecord) => (
        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">{r.category as string}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r: AnyRecord) => {
        const statusConfig = projectStatuses.find((s) => s.value === r.status);
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig?.color || "bg-gray-100 text-gray-700"}`}>
            {statusConfig?.label || r.status}
          </span>
        );
      },
    },
    {
      key: "technologies",
      header: "Technologies",
      render: (r: AnyRecord) => (
        <div className="flex flex-wrap gap-1">
          {(r.technologies as string[])?.slice(0, 2).map((tech: string, i: number) => (
            <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
              {tech}
            </span>
          ))}
          {(r.technologies as string[])?.length > 2 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
              +{(r.technologies as string[]).length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "teamMembers",
      header: "Team",
      render: (r: AnyRecord) => (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users size={14} />
          {(r.teamMembers as string[])?.length || 0}
        </div>
      ),
    },
    {
      key: "isPublic",
      header: "Visibility",
      render: (r: AnyRecord) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.isPublic ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
          {r.isPublic ? "Public" : "Private"}
        </span>
      ),
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
      key: "startDate",
      header: "Start Date",
      render: (r: AnyRecord) => (
        <div className="text-sm text-muted-foreground">
          {r.startDate ? formatDate(r.startDate as string) : "—"}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (r: AnyRecord) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(r as unknown as ResearchProject)}
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
          <h1 className="text-3xl font-bold">Research & Development</h1>
          <p className="text-muted-foreground mt-1">Manage research projects and innovations</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Projects", value: projects.length, color: "bg-purple-500" },
          { label: "Ongoing", value: projects.filter((p) => p.status === "ongoing").length, color: "bg-blue-500" },
          { label: "Completed", value: projects.filter((p) => p.status === "completed").length, color: "bg-green-500" },
          { label: "Public", value: projects.filter((p) => p.isPublic).length, color: "bg-cyan-500" },
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
          <CardTitle>All Research Projects</CardTitle>
          <CardDescription>View and manage research initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={projects} loading={loading} searchKey="title" />
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Research Project" : "Create Research Project"}</DialogTitle>
            <DialogDescription>
              {editingProject ? "Update research project details" : "Add a new research project"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Thumbnail */}
            <div>
              <Label>Thumbnail Image</Label>
              <ImageUpload
                value={formData.thumbnailUrl}
                onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
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
                    if (!editingProject) {
                      setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }));
                    }
                  }}
                  placeholder="Quantum Computing Research"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="quantum-computing-research"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                placeholder="Describe the research project..."
              />
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-2 gap-4">
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
                    {projectStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <Label>Technologies</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
                  placeholder="Add a technology..."
                />
                <Button type="button" onClick={addTechnology} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                    {tech}
                    <button onClick={() => removeTechnology(index)} className="hover:text-blue-900">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Team Members */}
            <div>
              <Label>Team Members</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTeamMember())}
                  placeholder="Add a team member..."
                />
                <Button type="button" onClick={addTeamMember} variant="outline">
                  <Users className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.teamMembers.map((member, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2">
                    {member}
                    <button onClick={() => removeTeamMember(index)} className="hover:text-purple-900">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Gallery Images */}
            <div>
              <Label>Gallery Images</Label>
              <MultiImageUpload
                value={formData.galleryImages}
                onChange={(urls) => setFormData({ ...formData, galleryImages: urls })}
                maxImages={10}
              />
            </div>

            {/* Detailed Sections */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Research Details</h3>
              
              <div>
                <Label>Objectives</Label>
                <RichTextEditor
                  value={formData.objectives}
                  onChange={(value) => setFormData({ ...formData, objectives: value })}
                  placeholder="Project objectives and goals..."
                />
              </div>

              <div>
                <Label>Methodology</Label>
                <RichTextEditor
                  value={formData.methodology}
                  onChange={(value) => setFormData({ ...formData, methodology: value })}
                  placeholder="Research methodology and approach..."
                />
              </div>

              <div>
                <Label>Results</Label>
                <RichTextEditor
                  value={formData.results}
                  onChange={(value) => setFormData({ ...formData, results: value })}
                  placeholder="Research findings and results..."
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            {/* SEO */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">SEO Metadata</h3>
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="SEO title (defaults to project title)"
                />
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Input
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="SEO description"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-6 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="isPublic" className="cursor-pointer">
                  Public (visible on website)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured Project
                </Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingProject ? "Update Project" : "Create Project"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
