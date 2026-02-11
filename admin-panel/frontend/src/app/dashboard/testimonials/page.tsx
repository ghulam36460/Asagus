"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/data-table";
import { formatDate } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, Save, Loader2, Star } from "lucide-react";

interface Testimonial {
  id: string;
  clientName: string;
  clientTitle: string;
  clientCompany: string;
  clientAvatar?: string;
  content: string;
  rating: number;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    clientName: "", clientTitle: "", clientCompany: "", clientAvatar: "",
    content: "", rating: 5, featured: false, published: true, sortOrder: 0
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: Testimonial[] }>("/testimonials");
      setTestimonials(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function openCreate() {
    setEditing(null);
    setForm({ clientName: "", clientTitle: "", clientCompany: "", clientAvatar: "", content: "", rating: 5, featured: false, published: true, sortOrder: 0 });
    setShowModal(true);
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setForm({
      clientName: t.clientName, clientTitle: t.clientTitle, clientCompany: t.clientCompany,
      clientAvatar: t.clientAvatar || "", content: t.content, rating: t.rating,
      featured: t.featured, published: t.published, sortOrder: t.sortOrder
    });
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) { await api.put(`/testimonials/${editing.id}`, form); }
      else { await api.post("/testimonials", form); }
      setShowModal(false); fetchData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    try { await api.delete(`/testimonials/${id}`); fetchData(); }
    catch (err) { console.error(err); }
  }

  const columns: Column[] = [
    { key: "clientName", header: "Client" },
    { key: "clientCompany", header: "Company" },
    {
      key: "rating", header: "Rating",
      render: (r) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={14} className={i < (r.rating as number) ? "text-yellow-400 fill-yellow-400" : "text-slate-300"} />
          ))}
        </div>
      ),
    },
    {
      key: "published", header: "Status",
      render: (r) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
          {r.published ? "Published" : "Draft"}
        </span>
      ),
    },
    { key: "createdAt", header: "Added", render: (r) => formatDate(r.createdAt as string) },
    {
      key: "actions", header: "Actions",
      render: (r) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(r as unknown as Testimonial)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={15} /></button>
          <button onClick={() => handleDelete(r.id as string)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Testimonials</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{testimonials.length} testimonials</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ backgroundColor: "var(--primary)" }}><Plus size={16} /> Add Testimonial</button>
      </div>

      <DataTable columns={columns} data={testimonials as unknown as Record<string, unknown>[]} loading={loading} emptyMessage="No testimonials" />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
          <div className="rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>{editing ? "Edit" : "New"} Testimonial</h2>
              <button onClick={() => setShowModal(false)} className="p-1"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Client Name *</label>
                  <input value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Title</label>
                  <input value={form.clientTitle} onChange={e => setForm({ ...form, clientTitle: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Company</label>
                <input value={form.clientCompany} onChange={e => setForm({ ...form, clientCompany: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border text-sm"
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Content *</label>
                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                  rows={4} className="w-full px-4 py-2 rounded-xl border text-sm resize-none"
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}>
                        <Star size={20} className={n <= form.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: +e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                  <span className="text-sm" style={{ color: "var(--foreground)" }}>Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
                  <span className="text-sm" style={{ color: "var(--foreground)" }}>Published</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border text-sm"
                style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.clientName || !form.content}
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
