import type { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
  accentLine?: "horizontal" | "vertical" | "none";
  alignment?: "left" | "center";
  className?: string;
}

export const SectionTitle = ({
  children,
  subtitle,
  accentLine = "horizontal",
  alignment = "left",
  className = "",
}: SectionTitleProps) => {
  const { elementRef, isVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <div
      ref={elementRef}
      className={`relative mb-16 fade-in ${isVisible ? 'visible' : ''} ${className}`}
    >
      {/* Pink accent line */}
      {accentLine === "horizontal" && (
        <div className="hidden md:block absolute -top-8 left-0 w-64 h-2 bg-magenta"></div>
      )}
      {accentLine === "vertical" && (
        <div className="hidden md:block absolute -left-8 top-0 w-2 h-64 bg-magenta"></div>
      )}

      <h2
        className={`text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display text-foreground mb-8 leading-[1.15] tracking-tight break-words hyphens-auto ${
          alignment === "center" ? "text-center" : ""
        } ${accentLine === "vertical" ? "ml-8" : ""}`}
      >
        {children}
      </h2>

      {subtitle && (
        <p className="text-xl text-muted-foreground leading-relaxed max-w-reading">
          {subtitle}
        </p>
      )}
    </div>
  );
};
