import { BeltLevel } from "@/types";
import { BELT_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BeltBadgeProps {
  belt: BeltLevel;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BeltBadge({ belt, className, size = "md" }: BeltBadgeProps) {
  const colors = BELT_COLORS[belt] || BELT_COLORS["BLANC"];
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base font-bold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border shadow-sm transition-all",
        colors.bg,
        colors.text,
        colors.border,
        sizeClasses[size],
        className
      )}
    >
      {belt}
    </span>
  );
}