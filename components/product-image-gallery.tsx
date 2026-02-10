"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ProductImageGalleryProps = {
  images: { url: string }[];
  alt: string;
};

export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        No image
      </div>
    );
  }

  const selected = images[selectedIndex];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
        <Image
          src={selected.url}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={selectedIndex === 0}
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border-2 bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                i === selectedIndex
                  ? "border-foreground ring-offset-2"
                  : "border-transparent hover:border-muted-foreground/30"
              )}
            >
              <Image
                src={img.url}
                alt={`${alt} ${i + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
