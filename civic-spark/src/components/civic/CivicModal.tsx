import React, { useEffect } from "react";
import { X } from "lucide-react";

interface CivicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function CivicModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-lg",
}: CivicModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#080808]/85 backdrop-blur-md animate-fade-in"
      />

      {/* Modal Container */}
      <div
        className={`relative z-10 w-full ${maxWidth} bg-[#0A0A0A] hairline shadow-2xl transition-all transform duration-200 scale-100 p-6 md:p-8 animate-fade-up`}
      >
        <div className="flex items-start justify-between pb-4 hairline-b mb-6">
          <div>
            <h3 className="font-mono text-base uppercase text-white font-medium tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="font-mono text-xs text-[#71717A] mt-1">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-white/10 text-[#A1A1AA] hover:text-white hover:border-white/30 transition-all font-mono"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
