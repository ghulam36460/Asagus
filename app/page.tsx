import { HeroSection } from "@/components/hero-section";
import { BentoServicesSection } from "@/components/bento-services-section";
import { ProjectsSection } from "@/components/projects-section";
import { ContactSection } from "@/components/contact-section";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollProgress } from "@/components/scroll-progress";
import { LiveChat } from "@/components/live-chat";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="relative">
      <ScrollProgress />
      <LiveChat />
      <ThemeToggle />
      <HeroSection />
      <BentoServicesSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
