import { HeroSection } from "@/components/HeroSection";
import { ProjectSection } from "@/components/ProjectSection";
import { CollaborationSection } from "@/components/CollaborationSection";
import { LocationSection } from "@/components/LocationSection";
import { PricingSection } from "@/components/PricingSection";
import { TimelineSection } from "@/components/TimelineSection";
import { InscriptionForm } from "@/components/InscriptionForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ProjectSection />
      <CollaborationSection />
      <LocationSection />
      <PricingSection />
      <InscriptionForm />
      <TimelineSection />
      <Footer />
    </div>
  );
};

export default Index;
