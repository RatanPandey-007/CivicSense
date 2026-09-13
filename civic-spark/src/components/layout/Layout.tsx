import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CustomCursor } from "@/components/civic/CustomCursor";
import { MobileBottomNav } from "@/components/civic/MobileBottomNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#080808] text-white selection:bg-[#6366F1] selection:text-white pb-16 md:pb-0">
      <CustomCursor />
      <Header />
      <main className="flex-1 pt-[73px]">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

