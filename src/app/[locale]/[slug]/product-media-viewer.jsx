"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import ImageProductPlaceholder from "@/assets/images/productPlaceholder.png";
import MediaViewer from "@/components/media-view";
import { getCloudinaryThumbnail } from "@/utils";

export function ProductMediaViewer({ product }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const mediaItems = [
    { id: "main", type: "image", url: product.mainImageUrl },
    ...product.images.map((img) => ({
      id: img.id,
      type: "image",
      url: img.url,
    })),
    ...(product.videoUrl
      ? [{ id: "video", type: "video", url: product.videoUrl }]
      : []),
  ];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handlePrevious = () => {
    setSelectedIndex(
      (prev) => (prev - 1 + mediaItems.length) % mediaItems.length,
    );
  };

  return (
    <div className="space-y-3">
      <div className="relative aspect-square rounded-md border shadow-sm overflow-hidden animate-fade-in">
        {mediaItems[selectedIndex].type === "image" ? (
          <MediaViewer
            thumbnailUrl={mediaItems[selectedIndex].url}
            mediaUrl={mediaItems[selectedIndex].url}
            isVideo={false}
          />
        ) : (
          <div className="relative h-full w-full">
            <video
              src={mediaItems[selectedIndex].url}
              className="h-full w-full object-cover"
              loop
              muted
              autoPlay
              controls
            />
          </div>
        )}
        <Button
          variant="outline"
          size="icon"
          className="bg-transparent-primary absolute top-1/2 left-0 -translate-y-1/2"
          onClick={handlePrevious}
        >
          <ChevronLeft className="p-1" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-transparent-primary absolute top-1/2 right-0 -translate-y-1/2"
          onClick={handleNext}
        >
          <ChevronRight className="p-1" />
        </Button>
      </div>
      <div className="flex flex-row flex-wrap gap-3">
        {mediaItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "relative lg:w-20 lg:h-20 w-14 h-14 aspect-square overflow-hidden rounded-md shadow-sm",
              selectedIndex === index
                ? "ring-1 ring-primary"
                : "border hover:border-black-primary",
            )}
          >
            {item.type === "image" ? (
              <Image
                src={item.url || ImageProductPlaceholder}
                alt={`${product.name} thumbnail ${index + 1}`}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="flex h-full relative">
                <Image
                  src={
                    item.url
                      ? getCloudinaryThumbnail(item.url)
                      : ImageProductPlaceholder
                  }
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  priority
                  className="object-cover"
                />
                <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-black-primary" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
