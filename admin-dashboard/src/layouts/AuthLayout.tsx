import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] text-[#EDEDED] relative overflow-hidden selection:bg-[#6366F1]/30 selection:text-white">
      {/* Precision grid and ambient light */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-[#6366F1]/06 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-[#00F5D4]/03 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] opacity-60" />
      </div>

      <div className="z-10 w-full max-w-lg mx-auto p-4 flex items-center min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
