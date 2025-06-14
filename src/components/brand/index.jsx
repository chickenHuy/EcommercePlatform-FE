"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import IconNotFound from "../../../public/images/categoryNotFound.png";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Masonry from "react-masonry-css";
import BrandCard from "./brand-item";
import { getAllBrand, getBrandPage } from "@/api/user/brandRequest";

const ListBrandComponent = ({ isPage = false }) => {
  const [listBrand, setListBrand] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const scrollRef = useRef(null);
  const t = useTranslations("Search");

  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoading(true);
      try {
        let response = null;
        if (isPage) {
          response = await getAllBrand();
          const brands = response.result;

          const brandsWithHeight = brands.map((element) => ({
            ...element,
            height:
              Math.random() * (window.innerWidth / 10) +
              150 +
              window.innerWidth / 30,
          }));

          setListBrand(brandsWithHeight);
        } else {
          response = await getBrandPage(20);
          setListBrand(response.result.data);
        }
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    if (!isPage && scrollRef.current && !isHovering) {
      let animationFrameId;
      const container = scrollRef.current;
      const step = () => {
        if (!container) return;

        // Tăng scrollLeft
        container.scrollLeft += 0.5;

        // Kiểm tra nếu cuộn đến cuối danh sách ảo
        const maxScroll = container.scrollWidth / 2; // Vì danh sách đã nhân đôi
        if (container.scrollLeft >= maxScroll) {
          // Tắt smooth scrolling để reset không bị giật
          container.style.scrollBehavior = "auto";
          container.scrollLeft -= maxScroll; // Quay lại vị trí tương ứng trong danh sách gốc
          container.style.scrollBehavior = "smooth"; // Bật lại smooth scrolling
        }

        animationFrameId = requestAnimationFrame(step);
      };

      animationFrameId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [isPage, isHovering]);

  const SkeletonItem = () => {
    if (isPage) {
      return (
        <div className="skeleton-circle w-full aspect-square relative sm:mb-5 mb-3"></div>
      );
    } else {
      return (
        <div className="skeleton-item lg:w-[200px] lg:h-[200px] sm:w-[150px] sm:h-[150px] w-[70px] h-[70px] relative">
          <div className="skeleton-line w-[80%] sm:h-[40px] h-[20px] absolute bottom-5" />
        </div>
      );
    }
  };

  return (
    <div className="relative w-full h-fit">
      <div className="w-full h-fit flex flex-row justify-between items-center px-3">
        {!isPage ? (
          <>
            <h3 className="text-[1.2em] font-[900]">{t("list_brand")}</h3>
            <Link className="underline" href="/brands">
              {t("see_all")}
            </Link>
          </>
        ) : (
          <h3 className="sm:text-[2.2em] text-[1.5em] font-[900] w-full text-center animate-fade-in">
            {t("list_brand").toUpperCase()}
          </h3>
        )}
      </div>

      {isPage ? (
        <Masonry
          breakpointCols={{ default: 5, 1024: 4, 767: 2 }}
          className="main_grid_layout gap-3 sm:gap-5 mt-5"
          columnClassName="main_grid_item"
        >
          {isLoading
            ? Array.from({ length: 32 }).map((_, index) => (
                <SkeletonItem key={index} />
              ))
            : listBrand.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
        </Masonry>
      ) : (
        <>
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar p-3 relative"
          >
            {isLoading
              ? Array.from({ length: 20 }).map((_, index) => (
                  <SkeletonItem key={index} />
                ))
              : [
                  ...listBrand,
                  ...listBrand, // Nhân đôi danh sách để tạo hiệu ứng cuộn vô hạn
                ].map((brand, index) => (
                  <Link
                    href={`/search?brandId=${brand.id}`}
                    key={`${brand.id}-${index}`} // Key duy nhất cho mỗi item
                    className="lg:w-[200px] lg:h-[200px] sm:w-[150px] sm:h-[150px] w-[70px] h-[70px] flex-shrink-0 flex flex-col items-center gap-2 relative group"
                  >
                    <div className="w-full h-full relative">
                      <Image
                        src={brand.logoUrl || IconNotFound}
                        alt={brand.name}
                        fill
                        className="object-cover rounded-full shadow-md border border-white-secondary"
                      />
                    </div>
                    <p className="w-[80%] sm:p-2 p-1 sm:rounded-md rounded-sm absolute top-[45%] lg:text-[.9em] sm:text-[.8em] text-[.7em] text-white-primary text-center truncate backdrop-blur-sm bg-white-tertiary/50 group-hover:block hidden animate-fade-in-quick">
                      {brand.name.toUpperCase()}
                    </p>
                  </Link>
                ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ListBrandComponent;