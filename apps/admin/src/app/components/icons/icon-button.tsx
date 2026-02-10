import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "@/app/components/ui/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost";
}

/**
 * Универсальная кнопка с иконкой.
 * Все иконки внутри автоматически получают единые стили:
 * - opacity-40 в обычном состоянии
 * - opacity-100 при наведении
 * - плавный transition
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ 
    children, 
    className, 
    size = "md",
    variant = "default",
    ...props 
  }, ref) {
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12"
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md transition-colors",
          variant === "default" && "hover:bg-accent hover:text-accent-foreground",
          variant === "ghost" && "hover:bg-transparent",
          sizeClasses[size],
          "[&_svg]:opacity-40 [&_svg]:hover:opacity-100 [&_svg]:transition-opacity",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
