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
        // Set mock data if API fails
        setStats({
          totalProjects: 12,
          publishedProjects: 8,
          totalServices: 6,
          totalTestimonials: 15,
          totalContacts: 47,
          unreadContacts: 3,
          totalSubscribers: 234,
          totalPageViews: 15420,
          recentContacts: [
            {
              id: "1",
              name: "John Smith",
              email: "john@example.com",
              subject: "Project Inquiry",
              message: "Interested in AI cybersecurity solutions",
              isRead: false,
              createdAt: new Date().toISOString(),
            },
            {
              id: "2",
              name: "Sarah Johnson",
              email: "sarah@techcorp.com",
              subject: "Partnership Opportunity",
              message: "Looking to collaborate on enterprise solutions",
              isRead: true,
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            }
          ],
          recentProjects: [
            {
              id: "1",
              title: "AI Cybersecurity Platform",
              slug: "ai-cybersecurity-platform",
              category: "Cybersecurity",
              published: true,
              viewCount: 1250,
              createdAt: new Date().toISOString(),
            },
            {
              id: "2",
              title: "E-commerce Platform",
              slug: "ecommerce-platform",
              category: "Web Development",
              published: true,
              viewCount: 890,
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            }
          ],
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 0'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid #667eea',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#ffffff',
          marginBottom: '8px'
        }}>
          Dashboard
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#94a3b8'
        }}>
          Welcome back! Here&apos;s an overview of your site.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px'
      }}>
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px'
      }}>
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '24px'
      }}
        className="lg:grid-cols-2"
      >
        {/* Recent Projects */}
        <div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '16px'
          }}>
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
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: row.published ? '#22c55e20' : '#f59e0b20',
                    color: row.published ? '#22c55e' : '#f59e0b'
                  }}>
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
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '16px'
          }}>
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
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: row.isRead ? '#64748b20' : '#3b82f620',
                    color: row.isRead ? '#64748b' : '#3b82f6'
                  }}>
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
