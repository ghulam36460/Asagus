import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASAGUS Admin Panel",
  description: "Admin Panel for ASAGUS - AI, Cybersecurity & Web Development Solutions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
