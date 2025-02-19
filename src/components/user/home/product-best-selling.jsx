"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductPlaceHoler } from "@/assets/images/productPlaceholder.png";
import { getProductBestSelling } from "@/api/user/homeRequest";
import { Label } from "@/components/ui/label";

export default function ProductBestSelling() {
  const [listProduct, setListProduct] = useState([]);
  const pageNumber = 1;
  const pageSize = 24;
  const productLimit = 24;
  const [loadPage, setLoadPage] = useState(true);
  const scrollContainerRef = useRef(null);
  const videoRefs = useRef([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const fetchProductBestSelling = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await getProductBestSelling(
        pageNumber,
        pageSize,
        productLimit
      );
      setListProduct(response.result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadPage(false);
    }
  }, [pageNumber, pageSize, productLimit]);

  useEffect(() => {
    fetchProductBestSelling();
  }, [fetchProductBestSelling]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.play().catch((error) => {
            console.error("Error attempting to play", error);
          });
        } else {
          entry.target.pause();
        }
      });
    }, options);

    const currentVideoRefs = videoRefs.current;

    currentVideoRefs.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      currentVideoRefs.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.play().catch((error) => {
          console.error("Error attempting to play", error);
        });
      }
    });
  }, [listProduct]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const handleScroll = () => {
      if (container) {
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        const scrollLeft = container.scrollLeft;

        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
      }
    };

    container?.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        const scrollLeft = container.scrollLeft;

        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatPrice = (price) => {
    if (price < 1000000000) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    } else if (price > 1000000000) {
      const priceInMillions = (price / 1000000000).toFixed(1);
      return `${priceInMillions.replace(".0", "")} tỷ`;
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

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = direction === "left" ? -400 : 400;
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });

      setTimeout(() => {
        if (container) {
          const scrollWidth = container.scrollWidth;
          const clientWidth = container.clientWidth;
          const scrollLeft = container.scrollLeft;

          setCanScrollLeft(scrollLeft > 0);
          setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
        }
      }, 500);
    }
  };

  if (loadPage) {
    return (
      <div className="w-full h-16 flex items-center justify-center">
        <div className="flex space-x-4">
          <div className="w-4 h-4 bg-red-primary rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-red-primary rounded-full animate-bounce [animation-delay:-.1s]"></div>
          <div className="w-4 h-4 bg-red-primary rounded-full animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>
    );
  }

  if (listProduct.length === 0) {
    return null;
  }

  if (listProduct.length > 0) {
    return (
      <div className="w-full md:px-20 px-4 pb-4">
        <div className="flex flex-col mb-4 space-y-[8px]">
          <Label className="text-3xl font-bold text-center text-red-primary">
            Sản phẩm bán chạy nhất
          </Label>
          <div className="w-full h-[2px] bg-red-primary bg-opacity-75"></div>
        </div>

        <div className="relative group">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {listProduct.map((product, index) => (
              <Link
                href={`/${product.slug}`}
                key={index}
                className="block group flex-shrink-0 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                style={{ width: "calc(20% - 16px)", minWidth: "200px" }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <AspectRatio ratio={1 / 1}>
                      <div className="relative w-full h-full overflow-hidden group">
                        <video
                          ref={(el) => (videoRefs.current[index] = el)}
                          src={product.videoUrl}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loop
                          muted
                          playsInline
                          autoPlay
                        />
                        <div className="absolute bottom-2 left-2 w-1/4 h-1/4 bg-white-primary rounded-lg overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-110">
                          <Image
                            src={product.mainImageUrl || ProductPlaceHoler}
                            alt={product.name}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <Badge
                          variant="destructive"
                          className="absolute top-2 right-2 transition-transform duration-300 group-hover:scale-110"
                        >
                          -{product.percentDiscount}%
                        </Badge>
                      </div>
                    </AspectRatio>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-2 space-y-0 bg-white-primary overflow-hidden">
                    <Label className="text-sm font-bold line-clamp-2 w-full min-h-[2.5rem] leading-[1.25rem] hover:cursor-pointer">
                      {product.name}
                    </Label>
                    <div className="flex justify-between items-center w-full gap-[4px] mt-2 h-6 hover:cursor-pointer">
                      <Label className="text-red-primary font-bold text-sm hover:cursor-pointer flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        {formatPrice(product.salePrice)}
                      </Label>
                      <Label className="text-black-primary text-xs hover:cursor-pointer flex-shrink-0 transition-opacity duration-300 group-hover:opacity-75">
                        Đã bán {formatSold(product.sold)}
                      </Label>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 transition-all duration-300 group-hover:scale-150"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4 group-hover:scale-150" />
            </Button>
          )}

          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 transition-all duration-300 group-hover:scale-150"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4 group-hover:scale-150" />
            </Button>
          )}
        </div>
      </div>
    );
  }
}
