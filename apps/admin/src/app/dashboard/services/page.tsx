"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/data-table";

type AnyRecord = Record<string, any>;
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  icon: string;
  features: string[];
  deliverables: string[];
  isActive: boolean;
  featured: boolean;
  orderIndex: number;
  cardType: string;
  accentColor: string;
  categoryLabel: string;
  imageUrl: string;
  ctaLabel: string;
  ctaHref: string;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
}

const ICON_OPTIONS = [
  "Shield", "Code", "Cloud", "Brain", "Lock", "Globe",
  "Smartphone", "Database", "Cpu", "Terminal", "Layers", "Zap",
  "BarChart", "Settings", "Palette", "Cog", "ShieldCheck",
  "Code2", "MonitorSmartphone", "Bot", "Workflow", "Server",
];

const ACCENT_PRESETS = [
  { label: "Blue", value: "#3b82f6" },
  { label: "Purple", value: "#a78bfa" },
  { label: "Green", value: "#34d399" },
  { label: "Orange", value: "#fb923c" },
  { label: "Pink", value: "#f472b6" },
  { label: "Cyan", value: "#22d3ee" },
  { label: "Red", value: "#ef4444" },
  { label: "Amber", value: "#f59e0b" },
];

const defaultForm = {
  title: "",
  subtitle: "",
  description: "",
  icon: "Code",
  features: "",
  deliverables: "",
  isActive: true,
  featured: false,
  orderIndex: 0,
  cardType: "standard" as "hero" | "standard",
  accentColor: "#3b82f6",
  categoryLabel: "",
  imageUrl: "",
  ctaLabel: "Learn more",
  ctaHref: "#contact",
  metaTitle: "",
  metaDescription: "",
};

const inputStyle = {
  backgroundColor: "var(--background)",
  borderColor: "var(--border)",
  color: "var(--foreground)",
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "visual" | "seo">("content");
  const [form, setForm] = useState({ ...defaultForm });

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const res = await api.get<{ success: boolean; data: Service[] }>(
        `/services?${params.toString()}`
      );
      setServices(res.data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  function openCreate() {
    setEditing(null);
    setForm({ ...defaultForm, orderIndex: services.length });
    setActiveTab("content");
    setShowModal(true);
  }

  function openEdit(svc: Service) {
    setEditing(svc);
    setForm({
      title: svc.title || "",
      subtitle: svc.subtitle || "",
      description: svc.description || "",
      icon: svc.icon || "Code",
      features: svc.features?.join(", ") || "",
      deliverables: svc.deliverables?.join(", ") || "",
      isActive: svc.isActive ?? true,
      featured: svc.featured ?? false,
      orderIndex: svc.orderIndex ?? 0,
      cardType: (svc.cardType as "hero" | "standard") || "standard",
      accentColor: svc.accentColor || "#3b82f6",
      categoryLabel: svc.categoryLabel || "",
      imageUrl: svc.imageUrl || "",
      ctaLabel: svc.ctaLabel || "Learn more",
      ctaHref: svc.ctaHref || "#contact",
      metaTitle: svc.metaTitle || "",
      metaDescription: svc.metaDescription || "",
    });
    setActiveTab("content");
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        features: form.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        deliverables: form.deliverables
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
      };
      if (editing) {
        await api.put(`/services/${editing.id}`, payload);
      } else {
        await api.post("/services", payload);
      }
      setShowModal(false);
      fetchServices();
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service?")) return;
    try {
      await api.del(`/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  async function toggleActive(svc: Service) {
    try {
      await api.put(`/services/${svc.id}`, { isActive: !svc.isActive });
      fetchServices();
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  }

  async function toggleFeatured(svc: Service) {
    try {
      await api.put(`/services/${svc.id}`, { featured: !svc.featured });
      fetchServices();
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  }

  const columns: Column<AnyRecord>[] = [
    {
      key: "orderIndex",
      header: "#",
      render: (r) => (
        <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
          {r.orderIndex as number}
        </span>
      ),
    },
    {
      key: "title",
      header: "Service",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: 36,
              height: 36,
              backgroundColor: `${r.accentColor as string}18`,
              border: `1px solid ${r.accentColor as string}40`,
            }}
          >
            <span className="text-xs font-bold" style={{ color: r.accentColor as string }}>
              {(r.icon as string)?.charAt(0) || "S"}
            </span>
          </div>
          <div>
            <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
              {r.title as string}
            </div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {(r.categoryLabel as string) || (r.subtitle as string) || "—"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "cardType",
      header: "Card",
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            r.cardType === "hero"
              ? "bg-purple-100 text-purple-700"
              : "bg-zinc-100 text-zinc-600"
          }`}
        >
          {r.cardType === "hero" ? "Hero" : "Standard"}
        </span>
      ),
    },
    {
      key: "accentColor",
      header: "Color",
      render: (r) => (
        <div className="flex items-center gap-2">
          <div
            className="rounded-full"
            style={{
              width: 16,
              height: 16,
              backgroundColor: r.accentColor as string,
              border: "2px solid rgba(0,0,0,0.1)",
            }}
          />
          <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
            {r.accentColor as string}
          </span>
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (r) => (
        <button
          onClick={() => toggleActive(r as unknown as Service)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
            r.isActive
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
          }`}
        >
          {r.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
          {r.isActive ? "Active" : "Draft"}
        </button>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      render: (r) => (
        <button
          onClick={() => toggleFeatured(r as unknown as Service)}
          className="p-1.5 rounded-lg transition-colors hover:bg-yellow-50"
        >
          <Star
            size={16}
            className={r.featured ? "text-yellow-500 fill-yellow-500" : "text-zinc-300"}
          />
        </button>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (r) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEdit(r as unknown as Service)}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => handleDelete(r.id as string)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            Services
          </h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {services.length} services · Manage content, card design & layout
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "var(--primary)" }}
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--muted-foreground)" }}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={services as unknown as Record<string, unknown>[]}
        loading={loading}
        emptyMessage="No services found. Add your first service to get started."
      />

      {/* ═══ Modal ═══ */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                  {editing ? "Edit Service" : "New Service"}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  {editing ? `Editing: ${editing.title}` : "All fields control how the card looks on the website"}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b px-6 gap-0" style={{ borderColor: "var(--border)" }}>
              {(["content", "visual", "seo"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-4 py-2.5 text-sm font-medium capitalize transition-colors relative"
                  style={{
                    color: activeTab === tab ? "var(--primary)" : "var(--muted-foreground)",
                    borderBottom: activeTab === tab ? "2px solid var(--primary)" : "2px solid transparent",
                  }}
                >
                  {tab === "seo" ? "SEO" : tab === "visual" ? "Card Design" : "Content"}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="overflow-y-auto flex-1 px-6 py-5">
              {/* ── Content Tab ── */}
              {activeTab === "content" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Title *</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. AI & Machine Learning"
                      className="w-full px-4 py-2 rounded-xl border text-sm"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Subtitle</label>
                    <input
                      value={form.subtitle}
                      onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                      placeholder="Short tagline for the service"
                      className="w-full px-4 py-2 rounded-xl border text-sm"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Description *</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={4}
                      placeholder="Appears on the card and service page"
                      className="w-full px-4 py-2 rounded-xl border text-sm resize-none"
                      style={inputStyle}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Icon</label>
                      <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border text-sm" style={inputStyle}>
                        {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Sort Order</label>
                      <input type="number" value={form.orderIndex}
                        onChange={(e) => setForm({ ...form, orderIndex: +e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border text-sm" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
                      Features <span className="font-normal text-xs" style={{ color: "var(--muted-foreground)" }}>(comma separated)</span>
                    </label>
                    <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
                      placeholder="Custom LLMs, NLP, Computer Vision, AI Agents"
                      className="w-full px-4 py-2 rounded-xl border text-sm" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
                      Deliverables <span className="font-normal text-xs" style={{ color: "var(--muted-foreground)" }}>(comma separated)</span>
                    </label>
                    <input value={form.deliverables} onChange={(e) => setForm({ ...form, deliverables: e.target.value })}
                      placeholder="Architecture doc, trained model, deployment scripts"
                      className="w-full px-4 py-2 rounded-xl border text-sm" style={inputStyle} />
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.isActive}
                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
                      <span className="text-sm" style={{ color: "var(--foreground)" }}>Active (visible on website)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
                      <span className="text-sm" style={{ color: "var(--foreground)" }}>Featured</span>
                    </label>
                  </div>
                </div>
              )}

              {/* ── Card Design Tab ── */}
              {activeTab === "visual" && (
                <div className="space-y-5">
                  {/* Card Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>Card Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["standard", "hero"] as const).map((type) => (
                        <button key={type} onClick={() => setForm({ ...form, cardType: type })}
                          className="relative rounded-xl border-2 p-4 transition-all text-left"
                          style={{
                            borderColor: form.cardType === type ? "var(--primary)" : "var(--border)",
                            backgroundColor: form.cardType === type ? "var(--primary-foreground)" : "var(--background)",
                          }}>
                          <div className="text-sm font-semibold capitalize" style={{ color: "var(--foreground)" }}>{type}</div>
                          <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                            {type === "hero" ? "Large card with illustration — 2 per row" : "Compact card — 3 per row"}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Label */}
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Category Label</label>
                    <input value={form.categoryLabel} onChange={(e) => setForm({ ...form, categoryLabel: e.target.value })}
                      placeholder="e.g. AI & Machine Learning"
                      className="w-full px-4 py-2 rounded-xl border text-sm" style={inputStyle} />
                    <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                      Shown as a small uppercase label above the title on the card
                    </p>
                  </div>

                  {/* Accent Color */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>Accent Color</label>
                    <div className="flex items-center gap-3 flex-wrap">
                      {ACCENT_PRESETS.map((preset) => (
                        <button key={preset.value} onClick={() => setForm({ ...form, accentColor: preset.value })}
                          className="flex flex-col items-center gap-1 group" title={preset.label}>
                          <div className="rounded-full transition-transform group-hover:scale-110"
                            style={{
                              width: 28, height: 28, backgroundColor: preset.value,
                              border: form.accentColor === preset.value ? "3px solid var(--foreground)" : "3px solid transparent",
                              boxShadow: form.accentColor === preset.value ? `0 0 12px ${preset.value}60` : "none",
                            }} />
                          <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{preset.label}</span>
                        </button>
                      ))}
                      <div className="flex flex-col items-center gap-1">
                        <label className="rounded-full overflow-hidden cursor-pointer hover:scale-110 transition-transform"
                          style={{
                            width: 28, height: 28,
                            border: !ACCENT_PRESETS.some((p) => p.value === form.accentColor) ? "3px solid var(--foreground)" : "3px solid transparent",
                          }}>
                          <input type="color" value={form.accentColor}
                            onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                            className="w-full h-full cursor-pointer" style={{ padding: 0, border: "none" }} />
                        </label>
                        <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>Custom</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="rounded" style={{ width: 14, height: 14, backgroundColor: form.accentColor }} />
                      <input value={form.accentColor}
                        onChange={(e) => {
                          if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setForm({ ...form, accentColor: e.target.value });
                        }}
                        className="px-2 py-1 rounded-lg border text-xs font-mono w-24" style={inputStyle} />
                    </div>
                  </div>

                  {/* Card Image */}
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
                      Card Image URL <span className="font-normal text-xs" style={{ color: "var(--muted-foreground)" }}>(optional, for hero cards)</span>
                    </label>
                    <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      placeholder="https://... or /images/ai-illustration.png"
                      className="w-full px-4 py-2 rounded-xl border text-sm" style={inputStyle} />
                    {form.imageUrl && (
                      <div className="mt-2 rounded-lg overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                        <img src={form.imageUrl} alt="Card preview" className="w-full h-32 object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>CTA Button Text</label>
                      <input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                        placeholder="Learn more" className="w-full px-4 py-2 rounded-xl border text-sm" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>CTA Link</label>
                      <input value={form.ctaHref} onChange={(e) => setForm({ ...form, ctaHref: e.target.value })}
                        placeholder="#contact or /services/ai" className="w-full px-4 py-2 rounded-xl border text-sm" style={inputStyle} />
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>Card Preview</label>
                    <div className="rounded-xl p-6" style={{ backgroundColor: "#0a0a12" }}>
                      <div className="rounded-xl overflow-hidden"
                        style={{
                          background: "#111118", border: `1px solid ${form.accentColor}30`,
                          maxWidth: form.cardType === "hero" ? "100%" : 300,
                          boxShadow: `0 0 40px ${form.accentColor}10`,
                        }}>
                        <div className="p-5">
                          <span className="text-[10px] font-semibold uppercase tracking-widest block mb-2"
                            style={{ color: "rgba(255,255,255,0.4)" }}>
                            {form.categoryLabel || "Category"}
                          </span>
                          <div className="flex items-center justify-center rounded-lg mb-3"
                            style={{
                              width: 36, height: 36,
                              backgroundColor: `${form.accentColor}20`,
                              border: `1px solid ${form.accentColor}40`,
                            }}>
                            <span style={{ color: form.accentColor, fontSize: 14, fontWeight: 700 }}>
                              {form.icon?.charAt(0) || "S"}
                            </span>
                          </div>
                          <h3 className="text-white font-bold text-sm mb-1.5">{form.title || "Service Title"}</h3>
                          <p className="text-[11px] leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
                            {form.description?.substring(0, 120) || "Description will appear here..."}{form.description && form.description.length > 120 ? "..." : ""}
                          </p>
                          <span className="text-xs font-medium" style={{ color: form.accentColor }}>
                            {form.ctaLabel || "Learn more"} →
                          </span>
                        </div>
                        {form.cardType === "hero" && form.imageUrl && (
                          <img src={form.imageUrl} alt="" className="w-full h-24 object-cover"
                            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SEO Tab ── */}
              {activeTab === "seo" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
                      Meta Title <span className="font-normal text-xs" style={{ color: "var(--muted-foreground)" }}>({form.metaTitle.length}/60)</span>
                    </label>
                    <input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                      maxLength={60} placeholder="SEO title — defaults to service title"
                      className="w-full px-4 py-2 rounded-xl border text-sm" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
                      Meta Description <span className="font-normal text-xs" style={{ color: "var(--muted-foreground)" }}>({form.metaDescription.length}/160)</span>
                    </label>
                    <textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                      maxLength={160} rows={3} placeholder="SEO description — defaults to service description"
                      className="w-full px-4 py-2 rounded-xl border text-sm resize-none" style={inputStyle} />
                  </div>
                  <div className="rounded-xl p-4 border" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
                    <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>Google Preview</p>
                    <div className="text-blue-600 text-sm font-medium truncate">
                      {form.metaTitle || form.title || "Service Title"} — ASAGUS
                    </div>
                    <div className="text-green-700 text-xs truncate">
                      asagus.com/services/{form.title.toLowerCase().replace(/\s+/g, "-") || "..."}
                    </div>
                    <div className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--muted-foreground)" }}>
                      {form.metaDescription || form.description || "Service description will appear here in search results..."}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: "var(--border)" }}>
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border text-sm transition-colors hover:opacity-80"
                style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.title || !form.description}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-colors hover:opacity-90"
                style={{ backgroundColor: "var(--primary)" }}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {editing ? "Update Service" : "Create Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}}
