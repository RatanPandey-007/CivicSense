import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Impact from "./pages/Impact";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import Contact from "./pages/Contact";
import ReportIssue from "./pages/ReportIssue";
import TrackIssues from "./pages/TrackIssues";
import Volunteer from "./pages/Volunteer";
import GetStarted from "./pages/GetStarted";
import RequestData from "./pages/RequestData";
import FAQ from "./pages/FAQ";
import MediaKit from "./pages/MediaKit";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import CleanCity from "./pages/programs/CleanCity";
import TrafficDiscipline from "./pages/programs/TrafficDiscipline";
import PublicSafety from "./pages/programs/PublicSafety";
import GreenSpaces from "./pages/programs/GreenSpaces";
import CivicHeroes from "./pages/programs/CivicHeroes";
import CivicEducation from "./pages/programs/CivicEducation";
import CSRPartnership from "./pages/programs/CSRPartnership";
import CivicInnovation from "./pages/programs/CivicInnovation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/clean-city" element={<CleanCity />} />
            <Route path="/programs/traffic" element={<TrafficDiscipline />} />
            <Route path="/programs/public-safety" element={<PublicSafety />} />
            <Route path="/programs/green-spaces" element={<GreenSpaces />} />
            <Route path="/programs/civic-heroes" element={<CivicHeroes />} />
            <Route path="/programs/education" element={<CivicEducation />} />
            <Route path="/programs/csr" element={<CSRPartnership />} />
            <Route path="/programs/innovation" element={<CivicInnovation />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogArticle />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/report-issue" element={<ReportIssue />} />
            <Route path="/track" element={<TrackIssues />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/request-data" element={<RequestData />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/media" element={<MediaKit />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
