"use client";

import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IconNotFound from "../../../public/images/iconNotFound.png";
import Link from "next/link";

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
  rating,
  onAddToFavorites,
  isFavorite,
  link,
}) {
  return (
    <Link href={`/${link}`} passHref className="w-full h-full relative">
      <Card className="w-full h-full overflow-hidden flex flex-col rounded-md border-white-secondary shadow-sm hover:shadow-lg hover:scale-[1.015] transition duration-100">
        <CardHeader className="p-0 relative">
          <div className="relative w-full aspect-square overflow-hidden">
            {videoUrl ? (
              <video
                src={videoUrl}
                loop
                muted
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={mainImageUrl || IconNotFound}
                alt={name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-md"
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
                className={`w-4 h-4 ${
                  isFavorite ? "fill-red-primary text-red-primary" : ""
                }`}
              />
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-2 flex flex-col justify-between gap-1">
          <CardTitle className="text-[1em] text-ellipsis truncate">
            {name}
          </CardTitle>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-[12px] h-[12px] ${
                  i < Math.round(rating)
                    ? "text-yellow-primary fill-yellow-primary"
                    : ""
                }`}
              />
            ))}
            <span className="text-[.8em]">{rating && rating.toFixed(1)}</span>
          </div>

          <div className="flex items-center">
            <span className="text-[1em] text-red-primary">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <span className="mx-2 text-[1em] text-black-primary/50 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
