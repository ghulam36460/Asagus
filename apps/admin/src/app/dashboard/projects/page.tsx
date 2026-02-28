"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/data-table";
import { formatDate } from "@/lib/utils";
import { ImageUpload, MultiImageUpload } from "@/components/ui/image-upload";
import { TechnologySelector, Technology } from "@/components/ui/technology-selector";

type AnyRecord = Record<string, any>;
import {
  Plus, Search, Pencil, Trash2, Eye, EyeOff,
  X, Save, Loader2
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  tags: string[];
  technologies: string[];
  thumbnail: string;
  images: string[];
  clientName?: string;
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  "All", "Web Development", "Mobile Development", "AI & Machine Learning",
  "Cybersecurity", "Cloud Solutions", "DevOps", "Data Analytics",
  "E-Commerce", "SaaS"
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [form, setForm] = useState({
    title: "", description: "", fullDescription: "", category: "Web Development",
    challenge: "", solution: "",
    tags: "", technologies: [] as Technology[], clientName: "", projectUrl: "", githubUrl: "",
    thumbnail: "", images: [] as string[], featured: false, published: false
  });

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.append("search", search);
      if (category !== "All") params.append("category", category);
      const res = await api.get<{ success: boolean; data: Project[]; pagination: { total: number } }>(
        `/projects?${params.toString()}`
      );
      setProjects(res.data);
      setTotal(res.pagination.total);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  function openCreate() {
    setEditing(null);
    setForm({
      title: "", description: "", fullDescription: "", category: "Web Development",
      challenge: "", solution: "",
      tags: "", technologies: [], clientName: "", projectUrl: "", githubUrl: "",
      thumbnail: "", images: [], featured: false, published: false
    });
    setShowModal(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    setForm({
      title: project.title,
      description: project.description,
      fullDescription: (project as any).fullDescription || "",
      category: project.category,
      challenge: (project as any).challenge || "",
      solution: (project as any).solution || "",
      tags: project.tags?.join(", ") || "",
      technologies: (project as any).projectTechnologies?.map((pt: any) => pt.technology) || [],
      clientName: project.clientName || "",
      projectUrl: project.projectUrl || "",
      githubUrl: project.githubUrl || "",
      thumbnail: project.thumbnail || "",
      images: project.images || [],
      featured: project.featured,
      published: project.published,
    });
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        technologyIds: form.technologies.map(t => t.id),
      };
      // Remove technologies from payload since we send technologyIds instead
      delete (payload as any).technologies;
      
      if (editing) {
        await api.put(`/projects/${editing.id}`, payload);
      } else {
        await api.post("/projects", payload);
      }
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      console.error("Failed to save project:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.del(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  }

  async function togglePublished(project: Project) {
    try {
      await api.put(`/projects/${project.id}`, { published: !project.published });
      fetchProjects();
    } catch (err) {
      console.error("Failed to toggle published:", err);
    }
  }

  const columns: Column<AnyRecord>[] = [
    { key: "title", header: "Title" },
    { key: "category", header: "Category" },
    {
      key: "published", header: "Status",
      render: (row: AnyRecord) => (
        <button onClick={() => togglePublished(row as unknown as Project)}
          className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
            row.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
          }`}>
          {row.published ? "Published" : "Draft"}
        </button>
      ),
    },
    {
      key: "featured", header: "Featured",
      render: (row: AnyRecord) => row.featured ? (
        <span className="text-yellow-500">★</span>
      ) : <span className="text-slate-300">☆</span>,
    },
    {
      key: "viewCount", header: "Views",
      render: (row: AnyRecord) => <span>{row.viewCount ?? 0}</span>,
    },
    {
      key: "createdAt", header: "Created",
      render: (row: AnyRecord) => formatDate(row.createdAt as string),
    },
    {
      key: "actions", header: "Actions",
      render: (row: AnyRecord) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row as unknown as Project)}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={15} /></button>
          <button onClick={() => togglePublished(row as unknown as Project)}
            className="p-1.5 rounded-lg hover:bg-slate-100">
            {row.published ? <EyeOff size={15} className="text-slate-500" /> : <Eye size={15} className="text-green-600" />}
          </button>
          <button onClick={() => handleDelete(row.id as string)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Projects</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{total} total projects</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ backgroundColor: "var(--primary)" }}>
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--muted-foreground)" }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none"
            style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
        </div>
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-xl border text-sm outline-none"
          style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <DataTable columns={columns} data={projects as unknown as Record<string, unknown>[]} loading={loading}
        emptyMessage="No projects found" />

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-xl border text-sm disabled:opacity-50"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>Previous</button>
          <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>Page {page} of {Math.ceil(total / limit)}</span>
          <button disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-xl border text-sm disabled:opacity-50"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>Next</button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowModal(false)}>
          <div className="rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                {editing ? "Edit Project" : "New Project"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border text-sm"
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Short Description *</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief summary of the project"
                  className="w-full px-4 py-2 rounded-xl border text-sm"
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Full Description</label>
                <textarea value={form.fullDescription} onChange={e => setForm({ ...form, fullDescription: e.target.value })}
                  rows={4} placeholder="Detailed description of the project"
                  className="w-full px-4 py-2 rounded-xl border text-sm resize-none"
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Challenge</label>
                <textarea value={form.challenge} onChange={e => setForm({ ...form, challenge: e.target.value })}
                  rows={3} placeholder="Describe the main challenge or problem this project addressed"
                  className="w-full px-4 py-2 rounded-xl border text-sm resize-none"
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Solution</label>
                <textarea value={form.solution} onChange={e => setForm({ ...form, solution: e.target.value })}
                  rows={3} placeholder="Describe how this project solved the challenge"
                  className="w-full px-4 py-2 rounded-xl border text-sm resize-none"
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                    {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Client Name</label>
                  <input value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                  placeholder="e.g. React, Next.js, TypeScript"
                  className="w-full px-4 py-2 rounded-xl border text-sm"
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Technologies</label>
                <TechnologySelector
                  selectedTechnologies={form.technologies}
                  onChange={(technologies) => setForm({ ...form, technologies })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Project URL</label>
                  <input value={form.projectUrl} onChange={e => setForm({ ...form, projectUrl: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>GitHub URL</label>
                  <input value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Thumbnail Image</label>
                <ImageUpload 
                  value={form.thumbnail}
                  onChange={(url) => setForm({ ...form, thumbnail: url })}
                  onRemove={() => setForm({ ...form, thumbnail: "" })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
                  Gallery Images (up to 10)
                </label>
                <MultiImageUpload 
                  value={form.images}
                  onChange={(urls) => setForm({ ...form, images: urls })}
                  maxImages={10}
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured}
                    onChange={e => setForm({ ...form, featured: e.target.checked })}
                    className="rounded" />
                  <span className="text-sm" style={{ color: "var(--foreground)" }}>Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published}
                    onChange={e => setForm({ ...form, published: e.target.checked })}
                    className="rounded" />
                  <span className="text-sm" style={{ color: "var(--foreground)" }}>Published</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border text-sm"
                style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.title || !form.description}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                style={{ backgroundColor: "var(--primary)" }}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
