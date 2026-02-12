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
    <header className="sticky top-0 z-30 h-16 border-b flex items-center justify-between px-4 md:px-6 lg:pl-6"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
      {/* Search - Hidden on mobile, shown on tablet+ */}
      <div className="hidden md:flex items-center gap-2 max-w-md flex-1 lg:ml-0 ml-12">
        <Search size={18} style={{ color: "var(--muted-foreground)" }} />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-sm flex-1"
          style={{ color: "var(--foreground)" }}
        />
      </div>

      {/* Mobile spacer for menu button */}
      <div className="md:hidden flex-1 ml-12"></div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-black/5 transition-colors">
          <Bell size={20} style={{ color: "var(--muted-foreground)" }} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User menu */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              {user?.name || "Admin"}
            </p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {user?.roles?.[0]?.replace("_", " ") || "User"}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
