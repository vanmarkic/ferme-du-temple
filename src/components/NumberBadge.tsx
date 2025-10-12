interface NumberBadgeProps {
  number: number;
  variant?: "default" | "light" | "dark";
  className?: string;
}

export const NumberBadge = ({ number, variant = "default", className = "" }: NumberBadgeProps) => {
  const variantStyles = {
    default: "bg-magenta text-white",
    light: "bg-butter-yellow text-rich-black",
    dark: "bg-rich-black text-white"
  };

  return (
    <div
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-display font-bold text-lg ${variantStyles[variant]} ${className}`}
      aria-label={`Step ${number}`}
    >
      {number}
    </div>
  );
};
