"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
  className?: string;
  priority?: boolean;
}

export function ImageFallback({
  src,
  alt,
  width = 200,
  height = 200,
  fallbackSrc = "/placeholder.svg?height=400&width=400",
  className,
  priority = false,
  ...props
}: ImageFallbackProps &
  Omit<
    React.ComponentProps<typeof Image>,
    "src" | "alt" | "width" | "height"
  >) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(!priority);

  return (
    <div className="relative">
      {isLoading && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-muted animate-pulse ${className}`}
          //   style={{ width, height }}
        >
          <svg
            className="size-8 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="21" x2="3" y1="6" y2="6" />
            <line x1="15" x2="3" y1="12" y2="12" />
            <line x1="17" x2="3" y1="18" y2="18" />
          </svg>
        </div>
      )}
      <Image
        src={error ? fallbackSrc : src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onError={() => setError(true)}
        onLoad={() => setIsLoading(false)}
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        {...props}
      />
    </div>
  );
}
