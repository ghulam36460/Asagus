"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { DataTable, Column } from "@/components/data-table";
import { formatDate } from "@/lib/utils";
import { Search, Filter } from "lucide-react";

type AnyRecord = Record<string, any>;

interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: { email: string; firstName: string; lastName: string };
}

const ACTION_COLORS: Record<string, string> = {
  LOGIN: "bg-green-100 text-green-700",
  LOGOUT: "bg-slate-100 text-slate-600",
  CREATE: "bg-blue-100 text-blue-700",
  UPDATE: "bg-yellow-100 text-yellow-700",
  DELETE: "bg-red-100 text-red-700",
  READ: "bg-purple-100 text-purple-700",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.append("search", search);
      if (actionFilter !== "All") params.append("action", actionFilter);
      const res = await api.get<{ success: boolean; data: AuditEntry[]; pagination: { total: number } }>(
        `/analytics/audit-logs?${params.toString()}`
      );
      setLogs(res.data);
      setTotal(res.pagination.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search, actionFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns: Column<AnyRecord>[] = [
    {
      key: "user", header: "User",
      render: (r: AnyRecord) => {
        const user = r.user as AuditEntry["user"];
        return user ? `${user.firstName} ${user.lastName}` : "System";
      },
    },
    {
      key: "action", header: "Action",
      render: (r: AnyRecord) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${ACTION_COLORS[r.action as string] || "bg-slate-100 text-slate-600"}`}>
          {r.action as string}
        </span>
      ),
    },
    { key: "resource", header: "Resource" },
    { key: "resourceId", header: "Resource ID", render: (r: AnyRecord) => <span className="font-mono text-xs">{(r.resourceId as string)?.slice(0, 8) || "—"}</span> },
    { key: "ipAddress", header: "IP", render: (r: AnyRecord) => <span className="font-mono text-xs">{r.ipAddress as string || "—"}</span> },
    { key: "createdAt", header: "Time", render: (r: AnyRecord) => formatDate(r.createdAt as string) },
  ];

  const actions = ["All", "LOGIN", "LOGOUT", "CREATE", "UPDATE", "DELETE", "READ"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Audit Logs</h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>System activity history</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search logs..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none"
            style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }} />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} style={{ color: "var(--muted-foreground)" }} />
          <select value={actionFilter} onChange={e => { setActionFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 rounded-xl border text-sm outline-none"
            style={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}>
            {actions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <DataTable columns={columns} data={logs as unknown as Record<string, unknown>[]} loading={loading} emptyMessage="No audit logs" />

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
    </div>
  );
}
