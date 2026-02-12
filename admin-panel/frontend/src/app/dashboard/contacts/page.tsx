"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/data-table";
import { formatDate } from "@/lib/utils";
import { Search, Mail, MailOpen, Trash2, Eye, X, Reply, Loader2 } from "lucide-react";

type AnyRecord = Record<string, any>;

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  replyMessage?: string;
  repliedAt?: string;
  createdAt: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15;

  const [viewContact, setViewContact] = useState<Contact | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.append("search", search);
      if (filter === "unread") params.append("isRead", "false");
      if (filter === "read") params.append("isRead", "true");
      const res = await api.get<{ success: boolean; data: Contact[]; pagination: { total: number } }>(
        `/contacts?${params.toString()}`
      );
      setContacts(res.data);
      setTotal(res.pagination.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, filter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function markAsRead(id: string) {
    try {
      await api.put(`/contacts/${id}/read`, {});
      fetchData();
    } catch (err) { console.error(err); }
  }

  async function openView(contact: Contact) {
    setViewContact(contact);
    setReplyText("");
    if (!contact.isRead) await markAsRead(contact.id);
  }

  async function handleReply() {
    if (!viewContact || !replyText.trim()) return;
    setReplying(true);
    try {
      await api.post(`/contacts/${viewContact.id}/reply`, { message: replyText });
      setViewContact(null);
      fetchData();
    } catch (err) { console.error(err); }
    finally { setReplying(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this contact?")) return;
    try { await api.del(`/contacts/${id}`); fetchData(); } catch (err) { console.error(err); }
  }

  const unreadCount = contacts.filter(c => !c.isRead).length;

  const columns: Column<AnyRecord>[] = [
    {
      key: "name", header: "From",
      render: (r: AnyRecord) => (
        <div className="flex items-center gap-2">
          {!r.isRead && <div className="w-2 h-2 rounded-full bg-blue-500" />}
          <span className={!r.isRead ? "font-semibold" : ""}>{r.name as string}</span>
        </div>
      ),
    },
    { key: "email", header: "Email" },
    { key: "subject", header: "Subject" },
    {
      key: "isRead", header: "Status",
      render: (r: AnyRecord) => (
        <div className="flex items-center gap-1">
          {r.isReplied ? (
            <span className="flex items-center gap-1 text-xs text-green-600"><Reply size={12} /> Replied</span>
          ) : r.isRead ? (
            <span className="flex items-center gap-1 text-xs text-slate-500"><MailOpen size={12} /> Read</span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-blue-600 font-medium"><Mail size={12} /> New</span>
          )}
        </div>
      ),
    },
    { key: "createdAt", header: "Received", render: (r: AnyRecord) => formatDate(r.createdAt as string) },
    {
      key: "actions", header: "Actions",
      render: (r: AnyRecord) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openView(r as unknown as Contact)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Eye size={15} /></button>
          <button onClick={() => handleDelete(r.id as string)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Contacts</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{total} total, {unreadCount} unread</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none"
            style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
        </div>
        <div className="flex rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          {(["all", "unread", "read"] as const).map(f => (
            <button key={f} onClick={() => { setFilter(f); setPage(1); }}
              className={`px-4 py-2 text-sm capitalize ${filter === f ? "text-white" : ""}`}
              style={{ backgroundColor: filter === f ? "var(--primary)" : "var(--background)", color: filter === f ? "#fff" : "var(--foreground)" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} data={contacts as unknown as Record<string, unknown>[]} loading={loading} emptyMessage="No contacts" />

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

      {/* View / Reply Modal */}
      {viewContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewContact(null)}>
          <div className="rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>Contact Details</h2>
              <button onClick={() => setViewContact(null)} className="p-1"><X size={20} /></button>
            </div>
            <div className="space-y-3 text-sm" style={{ color: "var(--foreground)" }}>
              <p><span className="font-medium">Name:</span> {viewContact.name}</p>
              <p><span className="font-medium">Email:</span> {viewContact.email}</p>
              {viewContact.phone && <p><span className="font-medium">Phone:</span> {viewContact.phone}</p>}
              {viewContact.subject && <p><span className="font-medium">Subject:</span> {viewContact.subject}</p>}
              <div>
                <span className="font-medium">Message:</span>
                <p className="mt-1 p-3 rounded-xl" style={{ backgroundColor: "var(--background)" }}>{viewContact.message}</p>
              </div>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Received: {formatDate(viewContact.createdAt)}</p>

              {viewContact.isReplied && viewContact.replyMessage && (
                <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200">
                  <p className="text-xs font-medium text-green-700 mb-1">Reply sent {viewContact.repliedAt ? formatDate(viewContact.repliedAt) : ""}</p>
                  <p className="text-sm text-green-800">{viewContact.replyMessage}</p>
                </div>
              )}

              {!viewContact.isReplied && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Reply</label>
                  <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                    rows={3} placeholder="Write your reply..."
                    className="w-full px-4 py-2 rounded-xl border text-sm resize-none"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                  <div className="flex justify-end mt-2">
                    <button onClick={handleReply} disabled={replying || !replyText.trim()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                      style={{ backgroundColor: "var(--primary)" }}>
                      {replying ? <Loader2 size={16} className="animate-spin" /> : <Reply size={16} />}
                      Send Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
