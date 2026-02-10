import { useState } from "react";
import { cn } from "@/app/components/ui/utils";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Loader2 } from "lucide-react";

interface MediaImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string;
}

export function MediaImageWithLoader({ src, alt, className }: MediaImageWithLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Skeleton Loader */}
      <div
        className={cn(
          "absolute inset-0 bg-muted flex items-center justify-center transition-opacity duration-300",
          isLoaded ? "opacity-0" : "opacity-100"
        )}
      >
        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
      </div>

      {/* Actual Image with Fade-in */}
      <ImageWithFallback
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-500",
          isLoaded && !hasError ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsLoaded(true);
          setHasError(true);
        }}
      />
    </div>
  );
}
