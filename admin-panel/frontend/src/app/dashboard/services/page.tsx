"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/data-table";
import { Plus, Search, Pencil, Trash2, X, Save, Loader2 } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  icon: string;
  features: string[];
  published: boolean;
  sortOrder: number;
  createdAt: string;
}

const ICON_OPTIONS = [
  "Shield", "Code", "Cloud", "Brain", "Lock", "Globe",
  "Smartphone", "Database", "Cpu", "Terminal", "Layers", "Zap"
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", shortDescription: "", icon: "Code",
    features: "", published: true, sortOrder: 0
  });

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const res = await api.get<{ success: boolean; data: Service[] }>(`/services?${params.toString()}`);
      setServices(res.data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  function openCreate() {
    setEditing(null);
    setForm({ title: "", description: "", shortDescription: "", icon: "Code", features: "", published: true, sortOrder: 0 });
    setShowModal(true);
  }

  function openEdit(svc: Service) {
    setEditing(svc);
    setForm({
      title: svc.title, description: svc.description, shortDescription: svc.shortDescription || "",
      icon: svc.icon, features: svc.features?.join(", ") || "", published: svc.published, sortOrder: svc.sortOrder
    });
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = { ...form, features: form.features.split(",").map(f => f.trim()).filter(Boolean) };
      if (editing) { await api.put(`/services/${editing.id}`, payload); }
      else { await api.post("/services", payload); }
      setShowModal(false);
      fetchServices();
    } catch (err) { console.error("Failed to save:", err); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service?")) return;
    try { await api.delete(`/services/${id}`); fetchServices(); }
    catch (err) { console.error("Delete failed:", err); }
  }

  const columns: Column[] = [
    { key: "title", header: "Title" },
    { key: "icon", header: "Icon" },
    {
      key: "published", header: "Status",
      render: (r) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
          {r.published ? "Active" : "Draft"}
        </span>
      ),
    },
    { key: "sortOrder", header: "Order" },
    {
      key: "actions", header: "Actions",
      render: (r) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(r as unknown as Service)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={15} /></button>
          <button onClick={() => handleDelete(r.id as string)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Services</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{services.length} services</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ backgroundColor: "var(--primary)" }}><Plus size={16} /> Add Service</button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none"
          style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
      </div>

      <DataTable columns={columns} data={services as unknown as Record<string, unknown>[]} loading={loading} emptyMessage="No services found" />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
          <div className="rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>{editing ? "Edit Service" : "New Service"}</h2>
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
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Short Description</label>
                <input value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border text-sm"
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Description *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3} className="w-full px-4 py-2 rounded-xl border text-sm resize-none"
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Icon</label>
                  <select value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                    {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: +e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Features (comma separated)</label>
                <input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border text-sm"
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded" />
                <span className="text-sm" style={{ color: "var(--foreground)" }}>Published</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border text-sm"
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
