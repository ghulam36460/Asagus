"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/data-table";

type AnyRecord = Record<string, any>;
import { formatDate } from "@/lib/utils";
import {
  Plus, Search, Pencil, Trash2, X, Save, Loader2,
  Shield, ShieldCheck, ShieldAlert, User
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  roles: Array<{ role: { name: string; displayName: string } }>;
}

const ROLES = ["super_admin", "admin", "editor", "viewer"];

const roleIcons: Record<string, typeof Shield> = {
  super_admin: ShieldAlert,
  admin: ShieldCheck,
  editor: Shield,
  viewer: User,
};

const roleColors: Record<string, string> = {
  super_admin: "bg-red-100 text-red-700",
  admin: "bg-purple-100 text-purple-700",
  editor: "bg-blue-100 text-blue-700",
  viewer: "bg-slate-100 text-slate-600",
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    email: "", firstName: "", lastName: "", password: "",
    role: "viewer", isActive: true
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const res = await api.get<{ success: boolean; data: AdminUser[] }>(`/auth/users?${params.toString()}`);
      setUsers(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function openCreate() {
    setEditing(null);
    setForm({ email: "", firstName: "", lastName: "", password: "", role: "viewer", isActive: true });
    setShowModal(true);
  }

  function openEdit(u: AdminUser) {
    setEditing(u);
    setForm({
      email: u.email, firstName: u.firstName, lastName: u.lastName,
      password: "", role: u.roles[0]?.role?.name || "viewer", isActive: u.isActive
    });
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) {
        const payload: Record<string, unknown> = { firstName: form.firstName, lastName: form.lastName, isActive: form.isActive };
        if (form.password) payload.password = form.password;
        await api.put(`/auth/users/${editing.id}`, payload);
      } else {
        await api.post("/auth/register", {
          email: form.email, password: form.password,
          firstName: form.firstName, lastName: form.lastName
        });
      }
      setShowModal(false); fetchData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this user? This action cannot be undone.")) return;
    try { await api.del(`/auth/users/${id}`); fetchData(); } catch (err) { console.error(err); }
  }

  const columns: Column<AnyRecord>[] = [
    {
      key: "name", header: "User",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
            style={{ backgroundColor: "var(--primary)" }}>
            {(r.firstName as string)?.[0]}{(r.lastName as string)?.[0]}
          </div>
          <div>
            <p className="font-medium text-sm" style={{ color: "var(--foreground)" }}>{r.firstName as string} {r.lastName as string}</p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{r.email as string}</p>
          </div>
        </div>
      ),
    },
    {
      key: "roles", header: "Role",
      render: (r) => {
        const roles = r.roles as Array<{ role: { name: string; displayName: string } }>;
        const roleName = roles?.[0]?.role?.name || "viewer";
        const Icon = roleIcons[roleName] || User;
        return (
          <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium w-fit ${roleColors[roleName] || ""}`}>
            <Icon size={12} /> {roles?.[0]?.role?.displayName || "Viewer"}
          </span>
        );
      },
    },
    {
      key: "isActive", header: "Status",
      render: (r) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {r.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    { key: "lastLogin", header: "Last Login", render: (r) => r.lastLogin ? formatDate(r.lastLogin as string) : "Never" },
    { key: "createdAt", header: "Joined", render: (r) => formatDate(r.createdAt as string) },
    {
      key: "actions", header: "Actions",
      render: (r) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(r as unknown as AdminUser)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil size={15} /></button>
          <button onClick={() => handleDelete(r.id as string)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Users</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{users.length} users</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ backgroundColor: "var(--primary)" }}><Plus size={16} /> Add User</button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none"
          style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
      </div>

      <DataTable columns={columns} data={users as unknown as Record<string, unknown>[]} loading={loading} emptyMessage="No users" />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
          <div className="rounded-2xl p-6 w-full max-w-lg" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>{editing ? "Edit" : "New"} User</h2>
              <button onClick={() => setShowModal(false)} className="p-1"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>First Name *</label>
                  <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Last Name *</label>
                  <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  disabled={!!editing}
                  className="w-full px-4 py-2 rounded-xl border text-sm disabled:opacity-50"
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
                  Password {editing ? "(leave blank to keep)" : "*"}
                </label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border text-sm"
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border text-sm"
                  style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                  {ROLES.map(r => <option key={r} value={r}>{r.replace("_", " ").replace(/^\w/, c => c.toUpperCase())}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                <span className="text-sm" style={{ color: "var(--foreground)" }}>Active</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border text-sm"
                style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.firstName || !form.lastName || !form.email || (!editing && !form.password)}
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
