import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Placeholder from "@/assets/images/productPlaceholder.png";
import Link from "next/link";
import { useDispatch } from "react-redux";
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
  const dispatch = useDispatch();
  return (
    <Link href={`/${link}`} passHref>
      <Card className="w-full h-[320px] cursor-pointer relative border-none transition-transform duration-300 hover:scale-[1.03] ">
        <CardHeader className="p-0 relative">
          <div className="relative aspect-square overflow-hidden">
            {videoUrl ? (
              <video
                src={videoUrl}
                loop
                muted
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-103"
              />
            ) : (
              <Image
                src={mainImageUrl ? mainImageUrl : Placeholder}
                alt={name}
                width={200}
                height={300}
                className="object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-103"
              />
            )}
            {mainImageUrl && videoUrl && (
              <div className="absolute bottom-0 left-0 z-10 w-1/3 h-1/3 border border-blue-primary rounded-lg">
                <Image
                  src={mainImageUrl}
                  alt={name}
                  width={68}
                  height={68}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute border-none top-2 right-2 z-10 bg-white-primary bg-opacity-50 hover:bg-opacity-100 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onAddToFavorites();
            }}
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? "fill-red-primary text-red-primary" : ""
              }`}
            />
          </Button>
        </CardHeader>
        <CardContent className="p-4 flex flex-col flex-grow">
          <CardTitle className="text-sm font-semibold line-clamp-2 truncate">
            {name}
          </CardTitle>
          <div className="flex items-center mt-2">
            {rating &&
              [...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.round(rating)
                      ? "text-yellow-primary fill-yellow-primary"
                      : "text-gray-primary"
                  }`}
                />
              ))}
            <span className="ml-2 text-xs text-gray-600">
              {rating && rating.toFixed(1)}
            </span>
          </div>
          <div className="mt-2">
            <span className="text-sm font-bold text-red-primary">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <span className="ml-2 text-xs text-gray-tertiary line-through truncate">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </CardContent>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg" />
      </Card>
    </Link>
  );
}
