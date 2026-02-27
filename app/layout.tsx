import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollRevealProvider } from "@/components/scroll-reveal-provider";
import { SiteHeader } from "@/components/site-header";

import { StructuredData } from "./structured-data";
import { ComprehensiveSEO } from "./comprehensive-seo";
import { GEOSchema } from "./geo-schema";
import { AIMetaTags } from "./ai-meta";
import { CitationGuide } from "./citation-guide";
import { ConversationalContent } from "./conversational-content";

const azonix = localFont({
  src: "../font/Azonix-1VB0.otf",
  variable: "--font-azonix",
  display: "swap",
  weight: "400",
});

const roboto = localFont({
  src: "../font/Roboto-VariableFont_wdth,wght.ttf",
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://asagus.com'),
  title: {
    default: "ASAGUS - AI, Web Development & Custom Software Solutions",
    template: "%s | ASAGUS"
  },
  description: "ASAGUS is a leading software development company specializing in AI solutions, custom web applications, mobile apps, and intelligent systems. Founded in 2024, we build scalable, high-performance digital products that solve real-world problems.",
  keywords: [
    "ASAGUS",
    "software development company",
    "AI development",
    "web development",
    "mobile app development",
    "custom software solutions",
    "artificial intelligence",
    "machine learning",
    "API development",
    "backend engineering",
    "Next.js development",
    "React development",
    "MERN stack",
    "scalable applications",
    "intelligent systems",
    "digital solutions"
  ],
  authors: [{ name: "ASAGUS", url: "https://asagus.com" }],
  creator: "ASAGUS",
  publisher: "ASAGUS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'en-GB': '/en-GB',
      'en-AU': '/en-AU',
      'en-CA': '/en-CA',
      'en-IN': '/en-IN',
      'en-SG': '/en-SG',
      'en-AE': '/en-AE',
      'en-NZ': '/en-NZ',
    },
  },
  openGraph: {
    title: "ASAGUS - AI, Web Development & Custom Software Solutions",
    description: "Build smart, scalable, and impactful digital solutions with ASAGUS. We specialize in AI-based systems, modern websites, custom software, and intelligent AI tools.",
    type: "website",
    locale: "en_US",
    url: 'https://asagus.com',
    siteName: "ASAGUS",
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'ASAGUS - Software Development Company',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ASAGUS - AI, Web Development & Custom Software Solutions",
    description: "Build smart, scalable, and impactful digital solutions with ASAGUS. We specialize in AI-based systems, modern websites, custom software, and intelligent AI tools.",
    creator: "@asagus",
    images: ['/opengraph-image'],
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
      <head>
        <StructuredData />
        <ComprehensiveSEO />
        <GEOSchema />
        <AIMetaTags />
        <CitationGuide />
        <ConversationalContent />
      </head>
      <body
        className={`${azonix.variable} ${roboto.variable} antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll />
          <ScrollRevealProvider>
            <SiteHeader />
            {children}
          </ScrollRevealProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
