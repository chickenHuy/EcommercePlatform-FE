import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductPlaceHoler } from "@/assets/images/productPlaceholder.png";
import { getAccount } from "@/api/user/accountRequest";
import { getRecommendListProduct } from "@/api/ai/recommendRequest";

export default function ProductSuggestions() {
  const [listProduct, setListProduct] = useState([]);
  const [userId, setUserId] = useState(null);
  const videoRefs = useRef({});
  const [isVideoLoaded, setIsVideoLoaded] = useState({});

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await getAccount();
        setUserId(response.result.id);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccount();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchRecommendListProduct = async () => {
        try {
          const response = await getRecommendListProduct(userId);
          setListProduct(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchRecommendListProduct();
    }
  }, [userId]);

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
      <div className="w-full md:px-20 px-4 pb-4 mt-8">
        <div className="flex flex-col mb-4 space-y-[8px]">
          <Label className="text-3xl font-bold text-center text-red-primary">
            Gợi ý sản phẩm bởi AI
          </Label>
          <div className="w-full h-[2px] bg-red-primary bg-opacity-75"></div>
        </div>

        {/* map listProduct danh sách sản phẩm */}
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

                <CardFooter className="flex flex-col items-start space-y-[4px] p-[8px]">
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
    );
  }
}
