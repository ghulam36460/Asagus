import { HeroSection } from "@/components/hero-section";
import { ServicesShowcase } from "@/components/services-showcase";
import { BentoServicesSection } from "@/components/bento-services-section";
import { ProjectsSection } from "@/components/projects-section";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollProgress } from "@/components/scroll-progress";
import { LiveChat } from "@/components/live-chat";
import { Footer } from "@/components/footer";
import { fetchServices } from "@/lib/services-api";

export default async function Home() {
  const services = await fetchServices({ active: true });

  return (
    <main className="relative">
      <ScrollProgress />
      <LiveChat />
      <ThemeToggle />
      <HeroSection />
      <ProjectsSection />
      <ServicesShowcase services={services} />
      {/* legacy research & products section; content already defined in component */}
      <BentoServicesSection />
      <Footer />
    </main>
  );
}
