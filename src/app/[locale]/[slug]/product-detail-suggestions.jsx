import { getRecommendProduct } from "@/api/ai/recommendReqquest";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ProductDetailSuggestions({ productId }) {
  const [listProduct, setListProduct] = useState([]);
  const videoRefs = useRef({});
  const [isVideoLoaded, setIsVideoLoaded] = useState({});

  useEffect(() => {
    const fetchRecommendProduct = async () => {
      try {
        const response = await getRecommendProduct(productId);
        setListProduct(response.result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRecommendProduct();
  }, []);

  useEffect(() => {
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video
          .play()
          .catch((error) => console.log("Autoplay was prevented:", error));
      }
    });
  }, [listProduct]);

  const handleVideoLoad = (productId) => {
    setIsVideoLoaded((prev) => ({ ...prev, [productId]: true }));
  };

  const formatPrice = (price) => {
    if (price < 1000000000) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    } else if (price > 1000000000) {
      const priceInMillions = (price / 1000000000).toFixed(1);
      return `≈ ${priceInMillions.replace(".0", "")} tỷ`;
    }
  };

  const formatSold = (sold) => {
    if (sold < 1000) {
      return sold.toString();
    } else if (sold >= 1000 && sold < 1000000) {
      const soldInThousands = (sold / 1000).toFixed(1).replace(".", ",");
      return `${soldInThousands.replace(",0", "")}k`;
    } else if (sold > 1000000) {
      const soldInThousands = (sold / 1000000).toFixed(1).replace(".", ",");
      return `${soldInThousands.replace(",0", "")}tr`;
    }
  };

  if (listProduct.length === 0) {
    return null;
  }

  if (listProduct.length > 0) {
    return (
      <>
        <div className="space-y-8 bg-white-primary px-8 py-[24px]">
          <Label className="text-2xl font-bold">CÓ THỂ BẠN CŨNG THÍCH</Label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
            {listProduct.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:scale-105 transition-all duration-300"
              >
                <Link href={`/${product.slug}`}>
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <video
                        ref={(el) => (videoRefs.current[product.id] = el)}
                        src={product.videoUrl}
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                        onLoadedData={() => handleVideoLoad(product.id)}
                      />
                      {!isVideoLoaded[product.id] && (
                        <div className="absolute inset-0 bg-gray-primary bg-opacity-25 animate-pulse" />
                      )}
                      <div className="absolute bottom-2 left-2 w-16 h-16 overflow-hidden rounded-md border-[4px] border-white-primary">
                        <Image
                          src={product.mainImageUrl || ProductPlaceHoler}
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      {product.percentDiscount > 0 && (
                        <Badge className="absolute top-2 right-2 bg-red-primary">
                          -{product.percentDiscount}%
                        </Badge>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col items-start p-[8px]">
                    <Label className="text-sm font-bold line-clamp-2 w-full min-h-[2.5rem] leading-[1.25rem] hover:cursor-pointer">
                      {product.name}
                    </Label>

                    <div className="flex justify-between items-center w-full hover:cursor-pointer gap-[4px]">
                      <Label className="text-red-primary text-sm font-bold flex-shrink-0 hover:cursor-pointer">
                        {formatPrice(product.salePrice)}
                      </Label>
                      <Label className="text-xs flex-shrink-0 hover:cursor-pointer">
                        Đã bán {formatSold(product.sold)}
                      </Label>
                    </div>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-8" />
      </>
    );
  }
}
