"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StatsCard } from "@/components/stats-card";
import { DataTable } from "@/components/data-table";
import { formatDate, formatNumber } from "@/lib/utils";
import {
  FolderKanban,
  Briefcase,
  MessageSquareQuote,
  Mail,
  MailOpen,
  Users,
  Eye,
  TrendingUp,
} from "lucide-react";

interface DashboardData {
  totalProjects: number;
  publishedProjects: number;
  totalServices: number;
  totalTestimonials: number;
  totalContacts: number;
  unreadContacts: number;
  totalSubscribers: number;
  totalPageViews: number;
  recentContacts: Array<{
    id: string;
    name: string;
    email: string;
    subject?: string;
    isRead: boolean;
    createdAt: string;
  }>;
  recentProjects: Array<{
    id: string;
    title: string;
    slug: string;
    category: string;
    published: boolean;
    viewCount: number;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await api.get<{ success: boolean; data: DashboardData }>("/dashboard/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
          Welcome back! Here&apos;s an overview of your site.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Projects"
          value={stats?.totalProjects ?? 0}
          change={`${stats?.publishedProjects ?? 0} published`}
          changeType="positive"
          icon={FolderKanban}
          color="#3b82f6"
        />
        <StatsCard
          title="Active Services"
          value={stats?.totalServices ?? 0}
          icon={Briefcase}
          color="#8b5cf6"
        />
        <StatsCard
          title="Testimonials"
          value={stats?.totalTestimonials ?? 0}
          icon={MessageSquareQuote}
          color="#f59e0b"
        />
        <StatsCard
          title="Page Views"
          value={formatNumber(stats?.totalPageViews ?? 0)}
          icon={Eye}
          color="#22c55e"
        />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Contact Forms"
          value={stats?.totalContacts ?? 0}
          change={`${stats?.unreadContacts ?? 0} unread`}
          changeType={stats?.unreadContacts ? "negative" : "neutral"}
          icon={Mail}
          color="#ef4444"
        />
        <StatsCard
          title="Subscribers"
          value={stats?.totalSubscribers ?? 0}
          icon={Users}
          color="#06b6d4"
        />
        <StatsCard
          title="Unread Messages"
          value={stats?.unreadContacts ?? 0}
          icon={MailOpen}
          color="#f97316"
        />
        <StatsCard
          title="Growth"
          value="+12.5%"
          change="vs last month"
          changeType="positive"
          icon={TrendingUp}
          color="#10b981"
        />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
            Recent Projects
          </h2>
          <DataTable
            columns={[
              { key: "title", header: "Title" },
              { key: "category", header: "Category" },
              {
                key: "published",
                header: "Status",
                render: (row) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.published
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {row.published ? "Published" : "Draft"}
                  </span>
                ),
              },
              {
                key: "createdAt",
                header: "Date",
                render: (row) => formatDate(row.createdAt as string),
              },
            ]}
            data={(stats?.recentProjects ?? []) as Record<string, unknown>[]}
            emptyMessage="No projects yet"
          />
        </div>

        {/* Recent Contacts */}
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--foreground)" }}>
            Recent Contacts
          </h2>
          <DataTable
            columns={[
              { key: "name", header: "Name" },
              { key: "email", header: "Email" },
              {
                key: "isRead",
                header: "Status",
                render: (row) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.isRead
                      ? "bg-slate-100 text-slate-600"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {row.isRead ? "Read" : "New"}
                  </span>
                ),
              },
              {
                key: "createdAt",
                header: "Date",
                render: (row) => formatDate(row.createdAt as string),
              },
            ]}
            data={(stats?.recentContacts ?? []) as Record<string, unknown>[]}
            emptyMessage="No contacts yet"
          />
        </div>
      </div>
    </div>
  );
}
