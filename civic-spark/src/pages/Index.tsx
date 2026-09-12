import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ExecutiveSummary } from "@/components/home/ExecutiveSummary";
import { ProgramsPreview } from "@/components/home/ProgramsPreview";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ExecutiveSummary />
      <ProgramsPreview />
      <HowItWorks />
      <CTASection />
    </Layout>
  );
};

export default Index;
