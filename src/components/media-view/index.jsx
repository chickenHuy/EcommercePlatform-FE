"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { PlayIcon } from "lucide-react";
import ImageProductPlaceholder from "@/assets/images/productPlaceholder.png";

export default function MediaViewer({
  thumbnailUrl,
  mediaUrl,
  isVideo = false,
  thumbnailSize = "w-full h-full",
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className={`relative cursor-pointer rounded-sm overflow-hidden ${thumbnailSize}`}
        >
          <Image
            src={thumbnailUrl || ImageProductPlaceholder}
            alt="thumbnail"
            fill
            className="object-cover rounded"
          />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayIcon className="text-black-primary fill-black-primary w-5 h-5" />
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[95vw] min-h-[95vh] p-0 bg-black-primary text-white-primary">
        <div className="relative w-[95vw] h-[95vh] m-auto">
          {isVideo ? (
            <video
              src={mediaUrl || ImageProductPlaceholder}
              className="h-full w-full object-contain"
              loop
              muted
              autoPlay
              controls
            />
          ) : (
            <Image
              src={mediaUrl || ImageProductPlaceholder}
              alt="media"
              fill
              className="object-contain"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
