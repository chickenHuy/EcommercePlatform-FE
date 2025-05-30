"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProductBestSelling } from "@/api/user/homeRequest";
import ProductCard from "@/components/card/productCard";
import ProductBestSellerImage from "../../../../public/images/product-best-seller.png";
import { useTranslations } from "next-intl";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";

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
    <div className="w-full h-fit flex flex-col justify-start items-center bg-black-secondary lg:pb-12 sm:pb-10 pb-8 pt-3 sm:rounded-xl rounded-md relative">
      <div className="w-full h-fit text-white-primary flex flex-row justify-start items-center gap-3 px-5">
        <h3 class="text-[1.2em] font-[900]">{t("best_selling_products")}</h3>
        <Image src={ProductBestSellerImage} height={70} width={70} className="w-14 h-14 aspect-square"></Image>
      </div>
      <div
        ref={scrollContainerRef}
        className="max-w-full flex flex-row overflow-x-auto lg:gap-5 gap-3 scroll-smooth no-scrollbar p-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {isLoading
          ? Array.from({ length: 20 }).map((_, index) => (
            <SkeletonItem key={index} />
          ))
          : listProduct.map((product, index) => (
            <div
              key={product.id || index}
              className="lg:min-w-[250px] min-w-[150px] lg:max-w-[250px] max-w-[150px]"
            >
              <ProductCard
                name={product.name}
                price={product.salePrice}
                originalPrice={product.originalPrice}
                mainImageUrl={product.mainImageUrl}
                videoUrl={product.videoUrl}
                sold={product.sold}
                rating={product.rating}
                showRating = {false}
                isFavorite={false}
                link={product.slug}
              />
            </div>
          ))}
      </div>
      <button
        aria-label="Scroll Right"
        onClick={() => scroll("right")}
        className="absolute top-1/2 right-[3px] flex items-center justify-center lg:p-3 p-[6px] rounded-full bg-white-primary/50 shadow-md hover:bg-white-primary hover:text-black-primary"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <button
        aria-label="Scroll Left"
        onClick={() => scroll("left")}
        className="absolute top-1/2 left-[3px] z-20 flex items-center justify-center lg:p-3 p-[6px] rounded-full bg-white-primary/50 shadow-md hover:bg-white-primary hover:text-black-primary"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
    </div>
  );
}
