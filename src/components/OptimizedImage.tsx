import { useState } from "react";
import { imageService } from "@/services/imageService";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  imageName?: string | null;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({ 
  imageName, 
  alt, 
  className, 
  fallback,
  onLoad,
  onError 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const imageUrl = imageService.getImageUrl(imageName);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Si no hay imagen, mostrar fallback
  if (!imageUrl) {
    return (
      <div className={cn(
        "bg-gray-100 flex items-center justify-center",
        className
      )}>
        {fallback || (
          <div className="text-gray-400 text-sm">
            Sin imagen
          </div>
        )}
      </div>
    );
  }

  // Si hay error, mostrar fallback
  if (hasError) {
    return (
      <div className={cn(
        "bg-gray-100 flex items-center justify-center",
        className
      )}>
        {fallback || (
          <div className="text-gray-400 text-sm">
            Error al cargar imagen
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Skeleton loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      
      {/* Imagen */}
      <img
        src={imageUrl}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
}