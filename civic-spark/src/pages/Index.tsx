import { IntroSequence } from "@/components/cinematic/IntroSequence";
import { CinematicNav } from "@/components/cinematic/CinematicNav";
import { HeroSection } from "@/components/cinematic/HeroSection";
import { ProblemSection } from "@/components/cinematic/ProblemSection";
import { ReportSection } from "@/components/cinematic/ReportSection";
import { AiEngineSection } from "@/components/cinematic/AiEngineSection";
import { CityMapSection } from "@/components/cinematic/CityMapSection";
import { LiveCityFieldSection } from "@/components/cinematic/LiveCityFieldSection";
import { MunicipalActionSection } from "@/components/cinematic/MunicipalActionSection";
import { TrackSection } from "@/components/cinematic/TrackSection";
import { ImpactSection } from "@/components/cinematic/ImpactSection";
import { EngineGridSection } from "@/components/cinematic/EngineGridSection";
import { SystemMetricsSection } from "@/components/cinematic/SystemMetricsSection";
import { FaqSection } from "@/components/cinematic/FaqSection";
import { FinalCtaSection } from "@/components/cinematic/FinalCtaSection";
import { CinematicFooter } from "@/components/cinematic/CinematicFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-[#6366F1] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* 2.05s First-visit cinematic intro */}
      <IntroSequence />

      {/* Minimal fixed navigation */}
      <CinematicNav />

      {/* Sequential Storytelling & Functional Intelligence Experience */}
      <main>
        {/* Hero with procedural 3D city grid & live HUD */}
        <HeroSection />

        {/* 01 · The Problem: Procedural signal accumulation overload */}
        <ProblemSection />

        {/* 02 · Report: 6-stage workflow & live embedded grievance terminal */}
        <ReportSection />

        {/* 03 · AI Engine: Procedural NLP tokenization & TF-IDF pipeline */}
        <AiEngineSection />

        {/* 04 · City Intelligence: Dark command map & issue inspection */}
        <CityMapSection />

        {/* 05 · Live City Field: 75 priority pulsing signals */}
        <LiveCityFieldSection />

        {/* 06 · Municipal Action: Jurisdiction routing & status lifecycle */}
        <MunicipalActionSection />

        {/* 07 · Track: Phone OTP verification & chronological audit timeline */}
        <TrackSection />

        {/* 08 · City Impact: Technical minimal charts & resolution analytics */}
        <ImpactSection />

        {/* 09 · Engine Architecture: 4 explicit columns with procedural canvas animations */}
        <EngineGridSection />

        {/* 10 · System Specifications: 4-column metric counters */}
        <SystemMetricsSection />

        {/* 11 · Technical FAQ: Native details/summary disclosure */}
        <FaqSection />

        {/* Final Statement with subtle generated city light */}
        <FinalCtaSection />
      </main>

      {/* Minimal Mono Footer */}
      <CinematicFooter />
    </div>
  );
};

export default Index;
