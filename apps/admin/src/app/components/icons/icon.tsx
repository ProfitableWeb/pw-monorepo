import { ReactElement, cloneElement } from "react";
import { cn } from "@/app/components/ui/utils";

interface IconProps {
  icon: ReactElement;
  opacity?: "low" | "medium" | "high";
  hoverOpacity?: "low" | "medium" | "high" | "full";
  className?: string;
}

const opacityMap = {
  low: "opacity-40",
  medium: "opacity-60",
  high: "opacity-80",
  full: "opacity-100"
};

/**
 * Обертка для иконок с едиными стилями прозрачности.
 * По умолчанию: opacity-40 -> hover:opacity-100
 */
export function Icon({ 
  icon, 
  opacity = "low", 
  hoverOpacity = "full",
  className 
}: IconProps) {
  return cloneElement(icon, {
    className: cn(
      icon.props.className,
      opacityMap[opacity],
      `hover:${opacityMap[hoverOpacity]}`,
      "transition-opacity",
      className
    )
  });
}
