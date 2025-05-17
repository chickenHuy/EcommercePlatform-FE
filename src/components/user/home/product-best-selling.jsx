"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProductBestSelling } from "@/api/user/homeRequest";
import ProductCard from "@/components/card/productCard";
import { useTranslations } from "next-intl";
import { Toaster } from "@/components/ui/toaster";

export default function ProductBestSelling() {
  const [listProduct, setListProduct] = useState([]);
  const pageNumber = 1;
  const pageSize = 24;
  const productLimit = 24;
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const videoRefs = useRef([]);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const t = useTranslations("Search");

  const fetchProductBestSelling = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await getProductBestSelling(
        pageNumber,
        pageSize,
        productLimit,
      );
      setListProduct(response.result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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

        setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = direction === "left" ? -500 : 500;
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });

      setTimeout(() => {
        if (container) {
          const scrollWidth = container.scrollWidth;
          const clientWidth = container.clientWidth;
          const scrollLeft = container.scrollLeft;

          setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
        }
      }, 500);
    }
  };

  const SkeletonItem = () => (
    <div className="skeleton-item w-[150px] h-[200px]">
      <div className="skeleton-line w-full aspect-square" />
      <div className="skeleton-line w-full h-full" />
    </div>
  );

  return (
    <div className="w-full pb-4">
      <Toaster />
      <h3 className="text-[1.3em] text-center border-b pb-2">
        {t("best_selling_products")}
      </h3>

      <div className="relative group">
        <div
          ref={scrollContainerRef}
          className="flex flex-row overflow-x-auto gap-4 scroll-smooth no-scrollbar py-3"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading
            ? Array.from({ length: 20 }).map((_, index) => (
                <SkeletonItem key={index} />
              ))
            : listProduct.map((product, index) => (
                <div key={index} className="lg:min-w-[150px] sm:min-w-[130px] min-w-[100px]">
                  <ProductCard
                    key={product.id}
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

        <button
          aria-label="Scroll Left"
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white-primary/50 shadow-md hover:bg-white-primary hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {canScrollRight && (
          <button
            aria-label="Scroll Right"
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white-primary/50 shadow-md hover:bg-white-primary hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
