"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0a0a0a'
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
    <div style={{ 
      minHeight: '100vh',
      background: '#0a0a0a'
    }}>
      <Sidebar />
      <div className="lg:ml-[280px]" style={{
        transition: 'margin-left 0.3s'
      }}
        className="lg:ml-[280px]"
      >
        <Header />
        <main style={{ padding: '24px' }}>{children}</main>
      </div>
    </div>
  );
}
