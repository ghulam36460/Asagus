"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { formatDate, formatNumber } from "@/lib/utils";
import { StatsCard } from "@/components/stats-card";
import { DataTable, Column } from "@/components/data-table";

type AnyRecord = Record<string, any>;
import { Eye, Users, Monitor, Globe, Calendar, TrendingUp } from "lucide-react";

interface AnalyticsOverview {
  totalPageViews: number;
  totalEvents: number;
  uniqueVisitors: number;
  topPages: Array<{ path: string; count: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
  browserBreakdown: Array<{ browser: string; count: number }>;
  dailyViews: Array<{ date: string; views: number }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: AnalyticsOverview }>(`/analytics/overview?period=${period}`);
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [period]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const topPagesColumns: Column<AnyRecord>[] = [
    { key: "path", header: "Page" },
    { key: "count", header: "Views", render: (r: AnyRecord) => formatNumber(r.count as number) },
  ];

  const deviceColumns: Column<AnyRecord>[] = [
    { key: "device", header: "Device" },
    { key: "count", header: "Visits", render: (r: AnyRecord) => formatNumber(r.count as number) },
  ];

  const browserColumns: Column<AnyRecord>[] = [
    { key: "browser", header: "Browser" },
    { key: "count", header: "Visits", render: (r: AnyRecord) => formatNumber(r.count as number) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Analytics</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Website performance overview</p>
        </div>
        <div className="flex rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          {[
            { value: "7d", label: "7 Days" },
            { value: "30d", label: "30 Days" },
            { value: "90d", label: "90 Days" },
          ].map(p => (
            <button key={p.value} onClick={() => setPeriod(p.value)}
              className="px-4 py-2 text-sm"
              style={{
                backgroundColor: period === p.value ? "var(--primary)" : "var(--background)",
                color: period === p.value ? "#fff" : "var(--foreground)"
              }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Page Views" value={formatNumber(data?.totalPageViews ?? 0)} icon={Eye} color="#3b82f6" />
        <StatsCard title="Unique Visitors" value={formatNumber(data?.uniqueVisitors ?? 0)} icon={Users} color="#8b5cf6" />
        <StatsCard title="Total Events" value={formatNumber(data?.totalEvents ?? 0)} icon={TrendingUp} color="#22c55e" />
        <StatsCard title="Avg. Daily Views" value={formatNumber(Math.round((data?.totalPageViews ?? 0) / (period === "7d" ? 7 : period === "30d" ? 30 : 90)))} icon={Calendar} color="#f59e0b" />
      </div>

      {/* Daily Views Chart (simple bar-style) */}
      {data?.dailyViews && data.dailyViews.length > 0 && (
        <div className="rounded-2xl p-6" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>Daily Page Views</h3>
          <div className="flex items-end gap-1 h-40">
            {data.dailyViews.map((d, i) => {
              const maxViews = Math.max(...data.dailyViews.map(v => v.views), 1);
              const height = (d.views / maxViews) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="hidden group-hover:block absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {formatDate(d.date)}: {d.views}
                  </div>
                  <div className="w-full rounded-t transition-all hover:opacity-80"
                    style={{ height: `${Math.max(height, 2)}%`, backgroundColor: "var(--primary)" }} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <Globe size={18} /> Top Pages
          </h3>
          <DataTable columns={topPagesColumns} data={(data?.topPages ?? []) as unknown as Record<string, unknown>[]} emptyMessage="No data" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <Monitor size={18} /> Devices
          </h3>
          <DataTable columns={deviceColumns} data={(data?.deviceBreakdown ?? []) as unknown as Record<string, unknown>[]} emptyMessage="No data" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <Globe size={18} /> Browsers
          </h3>
          <DataTable columns={browserColumns} data={(data?.browserBreakdown ?? []) as unknown as Record<string, unknown>[]} emptyMessage="No data" />
        </div>
      </div>
    </div>
  );
}
