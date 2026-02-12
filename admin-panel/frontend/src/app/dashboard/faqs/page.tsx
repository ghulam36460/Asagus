"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/data-table";
import { Plus, Pencil, Trash2, X, Save, Loader2, ChevronUp, ChevronDown } from "lucide-react";

type AnyRecord = Record<string, any>;

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
}

const FAQ_CATEGORIES = ["General", "Services", "Pricing", "Technical", "Support"];

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ question: "", answer: "", category: "General", published: true, sortOrder: 0 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: FAQ[] }>("/faqs");
      setFaqs(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function openCreate() {
    setEditing(null);
    setForm({ question: "", answer: "", category: "General", published: true, sortOrder: 0 });
    setShowModal(true);
  }

  function openEdit(f: FAQ) {
    setEditing(f);
    setForm({ question: f.question, answer: f.answer, category: f.category, published: f.published, sortOrder: f.sortOrder });
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) { await api.put(`/faqs/${editing.id}`, form); }
      else { await api.post("/faqs", form); }
      setShowModal(false); fetchData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    try { await api.del(`/faqs/${id}`); fetchData(); } catch (err) { console.error(err); }
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    const idx = faqs.findIndex(f => f.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= faqs.length) return;
    try {
      await api.put(`/faqs/${faqs[idx].id}`, { sortOrder: faqs[swapIdx].sortOrder });
      await api.put(`/faqs/${faqs[swapIdx].id}`, { sortOrder: faqs[idx].sortOrder });
      fetchData();
    } catch (err) { console.error(err); }
  }

  const columns: Column<AnyRecord>[] = [
    { key: "question", header: "Question" },
    { key: "category", header: "Category" },
    {
      key: "published", header: "Status",
      render: (r: AnyRecord) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
          {r.published ? "Published" : "Draft"}
        </span>
      ),
    },
    { key: "sortOrder", header: "Order" },
    {
      key: "actions", header: "Actions",
      render: (r: AnyRecord) => (
        <div className="flex items-center gap-1">
          <button onClick={() => handleReorder(r.id as string, "up")} className="p-1 rounded hover:bg-slate-100"><ChevronUp size={14} /></button>
          <button onClick={() => handleReorder(r.id as string, "down")} className="p-1 rounded hover:bg-slate-100"><ChevronDown size={14} /></button>
          <button onClick={() => openEdit(r as unknown as FAQ)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={15} /></button>
          <button onClick={() => handleDelete(r.id as string)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>FAQs</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{faqs.length} questions</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ backgroundColor: "var(--primary)" }}><Plus size={16} /> Add FAQ</button>
      </div>

      <DataTable columns={columns} data={faqs as unknown as Record<string, unknown>[]} loading={loading} emptyMessage="No FAQs" />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
          <div className="rounded-2xl p-6 w-full max-w-lg" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>{editing ? "Edit" : "New"} FAQ</h2>
              <button onClick={() => setShowModal(false)} className="p-1"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Question *</label>
                <input value={form.question} onChange={e => setForm({ ...form, question: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border text-sm"
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Answer *</label>
                <textarea value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })}
                  rows={4} className="w-full px-4 py-2 rounded-xl border text-sm resize-none"
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                    {FAQ_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: +e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
                <span className="text-sm" style={{ color: "var(--foreground)" }}>Published</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border text-sm"
                style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.question || !form.answer}
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
