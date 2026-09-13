import React, { useEffect } from "react";
import { X } from "lucide-react";

interface CivicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  side?: "right" | "left" | "bottom";
  widthClass?: string;
}

export function CivicDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  side = "right",
  widthClass = "max-w-xl",
}: CivicDrawerProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#080808]/80 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer content */}
      <div
        className={`relative z-10 w-full ${widthClass} bg-[#0A0A0A] hairline-l h-full ml-auto flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 hairline-b bg-[#080808]">
          <div>
            <span className="font-mono text-[10px] text-[#818CF8] uppercase tracking-[0.2em] block mb-1">
              COMMAND INSPECTOR
            </span>
            <h3 className="font-mono text-base uppercase text-white font-medium tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="font-mono text-xs text-[#71717A] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-white/10 hover:border-white/30 text-[#A1A1AA] hover:text-white transition-all font-mono"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">{children}</div>
      </div>
    </div>
  );
}
