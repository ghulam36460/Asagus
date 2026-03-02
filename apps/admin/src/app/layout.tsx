import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "ASAGUS Admin Panel",
  description: "Admin Panel for ASAGUS - AI, Cybersecurity & Web Development Solutions",
  icons: {
    icon: [
      // Default: white favicon for dark theme (no media query = base/default)
      { url: '/favicon/white-favicon.ico', type: 'image/x-icon' },
      // Override: black favicon for light theme
      { url: '/favicon/black-favicon.ico', media: '(prefers-color-scheme: light)', type: 'image/x-icon' },
    ],
    shortcut: '/favicon/white-favicon.ico',
    apple: '/favicon/white-favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/*
          ============================================================
          FAVICON STRATEGY — dark/light theme aware
          ============================================================
          RULE:
            - OS/browser DARK  theme → white-favicon.ico (white icon, visible on dark tab)
            - OS/browser LIGHT theme → black-favicon.ico (black icon, visible on white tab)

          HOW BROWSERS PICK (last matching wins):
            - Default (no media query) = white favicon for dark theme
            - Light mode override = black favicon
          ============================================================
        */}

        {/* Default (dark theme): white favicon — no media query = base default */}
        <link rel="icon" type="image/x-icon" href="/favicon/white-favicon.ico" />

        {/* Override for light theme: black favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon/black-favicon.ico" media="(prefers-color-scheme: light)" />

        {/* Shortcut icon — legacy browsers */}
        <link rel="shortcut icon" type="image/x-icon" href="/favicon/white-favicon.ico" />

        {/* Apple Touch Icon — iOS Safari */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/white-favicon.ico" />

        {/* Theme color for browser chrome */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
