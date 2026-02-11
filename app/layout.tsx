import type { Metadata } from "next";
import { Audiowide, PT_Sans_Caption } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollRevealProvider } from "@/components/scroll-reveal-provider";
import { FloatingNavbar } from "@/components/floating-navbar";
import { AnimatedBackground } from "@/components/animated-background";

const audiowide = Audiowide({
  weight: "400",
  variable: "--font-audiowide",
  subsets: ["latin"],
  display: "swap",
});

const ptSansCaption = PT_Sans_Caption({
  weight: ["400", "700"],
  variable: "--font-pt-sans-caption",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ASAGUS - Web Development Agency",
    template: "%s | ASAGUS"
  },
  description: "We create brands that people want to talk about. Expert web development, digital marketing, and brand design services with 8+ years of experience.",
  keywords: ["web development", "brand design", "digital marketing", "web agency", "UI/UX design", "SEO", "brand strategy"],
  authors: [{ name: "ASAGUS" }],
  creator: "ASAGUS",
  publisher: "ASAGUS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "ASAGUS - AI, Cybersecurity & Web Development",
    description: "Engineering the future of digital innovation",
    type: "website",
    locale: "en_US",
    siteName: "ASAGUS",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASAGUS - AI, Cybersecurity & Web Development",
    description: "Engineering the future of digital innovation",
    creator: "@asagus",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${audiowide.variable} ${ptSansCaption.variable} font-body antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AnimatedBackground />
          <SmoothScroll />
          <ScrollRevealProvider>
            <FloatingNavbar />
            {children}
          </ScrollRevealProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
