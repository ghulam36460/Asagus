"use client";

import { Bell, Search, User } from "lucide-react";
import { useEffect, useState } from "react";

interface AuthUser {
  name: string;
  email: string;
  roles: string[];
}

export function Header() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 30,
      height: '64px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      background: '#000000',
      backdropFilter: 'blur(10px)'
    }}>
      {/* Search - Hidden on mobile, shown on tablet+ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '480px',
        flex: 1,
        marginLeft: 0
      }}
        className="hidden md:flex lg:ml-0 ml-12"
      >
        <Search size={18} style={{ color: '#64748b' }} />
        <input
          type="text"
          placeholder="Search..."
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            flex: 1,
            color: '#ffffff'
          }}
        />
      </div>

      {/* Mobile spacer for menu button */}
      <div className="md:hidden flex-1 ml-12"></div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notifications */}
        <button style={{
          position: 'relative',
          padding: '10px',
          borderRadius: '10px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
        >
          <Bell size={20} style={{ color: '#64748b' }} />
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '8px',
            height: '8px',
            background: '#ef4444',
            borderRadius: '50%'
          }}></span>
        </button>

        {/* User menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }} className="hidden sm:block">
            <p style={{ 
              fontSize: '14px', 
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '2px'
            }}>
              {user?.name || "Super Admin"}
            </p>
            <p style={{ 
              fontSize: '12px',
              color: '#64748b'
            }}>
              {user?.roles?.[0]?.replace("_", " ") || "super admin"}
            </p>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#ffffff'
          }}>
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
