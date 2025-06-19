"use client";

import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IconNotFound from "../../../public/images/iconNotFound.png";
import Link from "next/link";
import { getSomeSecondVideoUrl } from "@/utils";
import { useTranslations } from "next-intl";
import { useRef } from "react";

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export default function ProductCard({
  name,
  price,
  originalPrice,
  mainImageUrl,
  videoUrl,
  sold = 0,
  brandName = null,
  rating,
  components = [],
  percentDiscount = null,
  showRating = true,
  onAddToFavorites,
  isFavorite,
  link,
  isMasonry = false,
}) {
  const t = useTranslations("Search");
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link href={`/${link}`} passHref className="w-full h-fit relative group" onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {percentDiscount &&
        <div className="w-fit h-fit px-1 rounded-sm bg-red-primary text-[.8em] text-white-primary absolute top-[5px] left-[5px] z-20">{"-" + percentDiscount + "%"}</div>
      }
      <Card className={`w-full h-fit ${isMasonry ? "mb-3" : ""} bg-white-primary overflow-hidden flex flex-col rounded-md border shadow-sm transition duration-150`}>
        <CardHeader className="p-0 relative">
          <div className="relative w-full aspect-square group-hover:-translate-y-[6px] transition duration-150">
            {videoUrl ? (
              <video
                ref={videoRef}
                src={getSomeSecondVideoUrl(videoUrl)}
                loop
                muted
                playsInline
                className="w-full aspect-square object-cover"
              />
            ) : (
              <Image
                src={mainImageUrl || IconNotFound}
                alt={name}
                fill
                className="object-cover"
              />
            )}
            {mainImageUrl && videoUrl && (
              <div className="absolute bottom-1 left-1 z-10 w-1/3 aspect-square border rounded-md">
                <Image
                  src={mainImageUrl}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
          {onAddToFavorites && (
            <Button
              variant="outline"
              size="icon"
              className="w-7 h-7 rounded-full absolute top-0 right-1 z-10 border-none shadow-md"
              onClick={(e) => {
                e.preventDefault();
                onAddToFavorites();
              }}
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? "fill-red-primary text-red-primary" : ""
                  }`}
              />
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-2 flex flex-col justify-between gap-2">
          <CardTitle className="w-full h-12 text-[1em] line-clamp-2">
            {name}
          </CardTitle>
          {brandName && (
            <div className="w-fit sm:text-[1em] text-[.8em] rounded-sm px-3 py-1 bg-blue-tertiary/50">
              {brandName}
            </div>
          )}
          {
            components.length > 0 && (
              <div className="w-full h-fit max-h-[200px] overflow-y-scroll flex flex-col gap-1 bg-blue-tertiary/50 p-2 pl-4 rounded-sm shadow-sm">
                {components.map((component, index) => (
                  component.value &&
                  <li
                    key={index}
                    className="text-[.8em]"
                  >
                    {component.name}: {component.value}
                  </li>
                ))}
              </div>
            )
          }
          <div className="w-full flex flex-row flex-wrap justify-between items-center gap-1 pt-2">
            {showRating &&
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-[12px] h-[12px] ${i < Math.round(rating)
                      ? "text-yellow-primary fill-yellow-primary"
                      : ""
                      }`}
                  />
                ))}
                <span className="text-[.8em]">{rating && rating.toFixed(1)}</span>
              </div>
            }
            <span className="text-[.8em]">{t("text_sold", { number: sold })}</span>
          </div>

          <div className="w-full flex flex-row flex-wrap justify-between items-center">
            {originalPrice && (
              <span className="sm:text-[1em] text-[.8em] text-black-primary/50 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="sm:text-[1.2em] text-[.9em] text-red-primary">
              {formatPrice(price)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
