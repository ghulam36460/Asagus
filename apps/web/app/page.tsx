import { HeroSection } from "@/components/hero-section";
import { ServicesShowcase } from "@/components/services-showcase";
import { BentoServicesSection } from "@/components/bento-services-section";
import { ProjectsSection } from "@/components/projects-section";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollProgress } from "@/components/scroll-progress";
import { LiveChat } from "@/components/live-chat";
import { Footer } from "@/components/footer";
import { fetchServices } from "@/lib/services-api";
import { fetchResearchProjects } from "@/lib/research-api";

export default async function Home() {
  // Use allSettled so a down API never breaks the page render
  const [servicesResult, researchResult] = await Promise.allSettled([
    fetchServices({ active: true }),
    fetchResearchProjects(),
  ]);

  const services        = servicesResult.status  === 'fulfilled' ? servicesResult.value  : [];
  const researchProjects = researchResult.status === 'fulfilled' ? researchResult.value  : [];

  return (
    <main className="relative">
      <ScrollProgress />
      <LiveChat />
      <ThemeToggle />
      <HeroSection />
      <ProjectsSection />
      <ServicesShowcase services={services} />
      {/* Research section — cards are created/edited/deleted via Admin Panel → Research */}
      <BentoServicesSection projects={researchProjects} />
      {/* ── Visible section-to-footer separator ─────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.1) 80%, transparent 100%)",
          boxShadow: "0 0 24px 1px rgba(255,255,255,0.04)",
        }}
      />
      <Footer />
    </main>
  );
}
