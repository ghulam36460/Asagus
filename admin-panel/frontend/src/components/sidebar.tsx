"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  MessageSquareQuote,
  HelpCircle,
  Mail,
  BarChart3,
  Users,
  Settings,
  Shield,
  LogOut,
  ChevronLeft,
  Menu,
  FileText,
  Search as SearchIcon,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Services", href: "/dashboard/services", icon: Briefcase },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Blog", href: "/dashboard/blog", icon: FileText },
  { name: "Research", href: "/dashboard/research", icon: SearchIcon },
  { name: "Testimonials", href: "/dashboard/testimonials", icon: MessageSquareQuote },
  { name: "FAQs", href: "/dashboard/faqs", icon: HelpCircle },
  { name: "Contacts", href: "/dashboard/contacts", icon: Mail },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Audit Logs", href: "/dashboard/audit-logs", icon: Shield },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

// Navigation content component (reusable for both desktop and mobile)
function SidebarContent({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Navigation */}
      <nav style={{ 
        flex: 1, 
        padding: collapsed ? '16px 8px' : '16px 12px', 
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" &&  pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: collapsed ? '0' : '12px',
                  padding: collapsed ? '12px 8px' : '12px 16px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  boxShadow: isActive ? '0 4px 12px rgba(102, 126, 234, 0.25)' : 'none',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
                title={collapsed ? item.name : undefined}
              >
                <item.icon size={20} style={{ flexShrink: 0 }} />
                {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div style={{ 
        padding: collapsed ? '12px 8px' : '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <button
          onClick={() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? '0' : '12px',
            padding: collapsed ? '12px 8px' : '12px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#f87171',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.2s',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =  'rgba(248, 113, 113, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <LogOut size={20} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 60,
          padding: '10px',
          borderRadius: '10px',
          background: '#1e293b',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          display: mobileOpen ? 'none' : 'block',
        }}
        className="lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 50,
          }}
          onClick={() => setMobileOpen(false)}
          className="lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '280px',
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s',
          zIndex: 55,
          display: 'flex',
          flexDirection: 'column',
        }}
        className="lg:hidden"
      >
        {/* Logo */}
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <Link href="/dashboard" style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: '#ffffff',
            textDecoration: 'none',
            letterSpacing: '1px'
          }}>
            ASAGUS
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              padding: '8px',
              borderRadius: '8px',
              background: 'transparent',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: collapsed ? '80px' : '280px',
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          transition: 'width 0.3s',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.12)',
        }}
        className="hidden lg:flex"
      >
        {/* Logo */}
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: collapsed ? '0 16px' : '0 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {!collapsed && (
            <Link href="/dashboard" style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              color: '#ffffff',
              textDecoration: 'none',
              letterSpacing: '1px'
            }}>
              ASAGUS
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <SidebarContent collapsed={collapsed} />
      </aside>
    </>
  );
}
