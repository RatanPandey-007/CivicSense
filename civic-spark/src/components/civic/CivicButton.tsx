import React from "react";

export interface CivicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export function CivicButton({
  children,
  variant = "primary",
  size = "md",
  icon,
  isLoading,
  className = "",
  disabled,
  ...props
}: CivicButtonProps) {
  const base =
    "relative inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.14em] font-medium transition-all duration-200 cursor-pointer select-none active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none";

  const sizeClasses = {
    sm: "text-[10px] px-3.5 py-1.5",
    md: "text-[11px] px-6 py-3",
    lg: "text-[12px] px-8 py-4",
  };

  const variantClasses = {
    primary:
      "bg-white text-[#080808] hover:bg-[#818CF8] hover:text-white hover:scale-[1.01] shadow-[0_0_16px_rgba(255,255,255,0.08)]",
    secondary:
      "border border-white/20 text-white bg-white/[0.02] hover:border-[#6366F1] hover:text-[#818CF8] hover:scale-[1.01]",
    danger:
      "bg-[#EF4444] text-white hover:bg-[#DC2626] hover:scale-[1.01] shadow-[0_0_16px_rgba(239,68,68,0.2)]",
    ghost:
      "text-[#A1A1AA] hover:text-white hover:bg-white/5 border border-transparent",
    accent:
      "bg-[#6366F1] text-white hover:bg-[#4338CA] hover:scale-[1.01] shadow-[0_0_16px_rgba(99,102,241,0.25)]",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
}
