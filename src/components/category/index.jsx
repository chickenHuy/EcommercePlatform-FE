"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllCategory, getCategoryPage } from "@/api/user/categoryRequest";
import IconNotFound from "../../../public/images/categoryNotFound.png";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Masonry from "react-masonry-css";
import CategoryCard from "./category-item";

const ListCategoryComponent = ({ isPage = false }) => {
  const [listCategory, setListCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);
  const t = useTranslations("Search");

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        let response = null;
        if (isPage) {
          response = await getAllCategory();
          const categories = response.result;

          const categoriesWithHeight = categories.map((element) => ({
            ...element,
            height: Math.random() * (window.innerWidth/4) + 200,
          }));

          setListCategory(categoriesWithHeight);
        } else {
          response = await getCategoryPage();
          setListCategory(response.result.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const SkeletonItem = () => {
    const height = Math.random() * (window.innerWidth/4) + 200;

    if (isPage) {
      return (
        <div style={{ height: height }} className="skeleton-item relative sm:mb-5 mb-3">
          <div className="skeleton-line w-[80%] sm:h-[40px] h-[20px] absolute bottom-5" />
        </div>
      );
    } else {
      return (
        <div className="skeleton-item lg:w-[300px] lg:h-[300px] sm:w-[200px] sm:h-[200px] w-[100px] h-[100px] relative">
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
            <h3 className="text-[1.2em] font-[900]">{t("product_category")}</h3>
            <Link className="underline" href="/categories">
              See All
            </Link>
          </>
        ) : (
          <h3 className="sm:text-[2.2em] text-[1.5em] font-[900] w-full text-center animate-fade-in">
            {t("product_category").toUpperCase()}
          </h3>
        )}
      </div>

      {isPage ? (
        <Masonry
          breakpointCols={{ default: 4, 1024: 3, 767: 2 }}
          className="main_grid_layout gap-3 sm:gap-5 mt-5"
          columnClassName="main_grid_item"
        >
          {isLoading
            ? Array.from({ length: 16 }).map((_, index) => (
                <SkeletonItem key={index} />
              ))
            : listCategory.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
        </Masonry>
      ) : (
        <>
          <button
            onClick={() => scroll("left")}
            className="absolute left-1 top-1/2 z-10 -translate-y-1/2 bg-white-primary/50 shadow-md p-2 rounded-full hover:bg-white-primary"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar p-3 relative"
          >
            {isLoading
              ? Array.from({ length: 20 }).map((_, index) => (
                  <SkeletonItem key={index} />
                ))
              : listCategory.map((category) => (
                  <div
                    key={category.id}
                    className="lg:w-[300px] lg:h-[300px] sm:w-[200px] sm:h-[200px] w-[100px] h-[100px] flex-shrink-0 flex flex-col items-center gap-2 relative group"
                  >
                    <div className="w-full h-full relative">
                      <Image
                        src={category.imageUrl || IconNotFound}
                        alt={category.name}
                        fill
                        className="object-cover rounded-xl shadow-md"
                      />
                    </div>
                    <p className="w-[80%] sm:p-2 p-1 sm:rounded-md rounded-sm absolute sm:bottom-5 bottom-3 lg:text-[.9em] sm:text-[.8em] text-[.7em] text-white-primary text-center truncate backdrop-blur-sm bg-white-tertiary/50 group-hover:block hidden animate-fade-in-quick">
                      {category.name.toUpperCase()}
                    </p>
                  </div>
                ))}
            <Link
              key="see_all"
              href="/categories"
              className="lg:w-[150px] lg:h-[300px] sm:w-[100px] sm:h-[200px] w-[50px] h-[100px] flex-shrink-0 flex justify-center items-center bg-white-secondary/50 hover:bg-white-secondary rounded-xl"
            >
              See All
            </Link>
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white-primary/50 shadow-md p-2 rounded-full hover:bg-white-primary"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};

export default ListCategoryComponent;
