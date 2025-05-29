"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProductBestSelling } from "@/api/user/homeRequest";
import ProductCard from "@/components/card/productCard";
import ProductBestSellerImage from "../../../../public/images/product-best-seller.png";
import { useTranslations } from "next-intl";
import { Toaster } from "@/components/ui/toaster";

export default function ProductBestSelling() {
  const [listProduct, setListProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const t = useTranslations("Search");

  const fetchProductBestSelling = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await getProductBestSelling(1, 24, 24);
      setListProduct(response.result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductBestSelling();
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -500 : 500;
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const SkeletonItem = () => (
    <div className="skeleton-item flex flex-col lg:min-w-[200px] sm:min-w-[150px] min-w-[100px] aspect-[3/4]">
      <div className="skeleton-line w-full h-3/4" />
      <div className="skeleton-line w-full h-1/4" />
    </div>
  );

  return (
    <div className="w-full h-fit flex flex-row justify-start items-center bg-black-secondary lg:py-12 sm:py-10 py-8 sm:rounded-xl rounded-md">
      <Toaster />
      <div className="lg:min-w-[200px] sm:min-w-[150px] min-w-[100px] text-white-primary flex flex-col justify-center items-center gap-3 h-fit px-3 relative">
        <Image src={ProductBestSellerImage} height={300} width={300} className="w-full aspect-square"></Image>
        <h3 className="lg:text-[1.3em] sm:text-[1.1em] text-[.9em] text-center">
          {t("best_selling_products")}
        </h3>

        <button
          aria-label="Scroll Right"
          onClick={() => scroll("right")}
          className="absolute left-1/2 -bottom-2 translate-y-full translate-x-1/3 z-20 flex items-center justify-center lg:p-3 p-[6px] rounded-full bg-white-primary/50 shadow-md hover:bg-white-primary hover:text-black-primary"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <button
          aria-label="Scroll Left"
          onClick={() => scroll("left")}
          className="absolute right-1/2 -bottom-2 translate-y-full -translate-x-1/3 z-20 flex items-center justify-center lg:p-3 p-[6px] rounded-full bg-white-primary/50 shadow-md hover:bg-white-primary hover:text-black-primary"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex flex-row overflow-x-auto lg:gap-5 gap-3 scroll-smooth no-scrollbar p-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {isLoading
          ? Array.from({ length: 20 }).map((_, index) => (
            <SkeletonItem key={index} />
          ))
          : listProduct.map((product, index) => (
            <div
              key={product.id || index}
              className="lg:max-w-[250px] sm:max-w-[150px] max-w-[100px]"
            >
              <ProductCard
                name={product.name}
                price={product.salePrice}
                originalPrice={product.originalPrice}
                mainImageUrl={product.mainImageUrl}
                videoUrl={product.videoUrl}
                rating={product.rating}
                isFavorite={false}
                link={product.slug}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
