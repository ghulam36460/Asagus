import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "ASAGUS Admin Panel",
  description: "Admin Panel for ASAGUS - AI, Cybersecurity & Web Development Solutions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
