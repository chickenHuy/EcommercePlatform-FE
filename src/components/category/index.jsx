"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllCategory } from "@/api/user/categoryRequest";
import IconNotFound from "../../../public/images/iconNotFound.png";

const ListCategoryComponent = () => {
  const [listCategory, setListCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await getAllCategory();
        setListCategory(response.result);
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

  const SkeletonItem = () => (
    <div className="skeleton-item w-[120px] h-[120px] ">
      <div className="skeleton-circle w-[70px] h-[70px]" />
      <div className="skeleton-line w-full h-[20px]" />
    </div>
  );

  return (
    <div className="relative w-full h-fit">
      <h3 className="text-[1.3em] text-red-primary text-center border-b py-3">
        Danh Mục Sản Phẩm
      </h3>

      <button
        onClick={() => scroll("left")}
        className="absolute left-1 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md p-1 rounded-full hover:bg-gray-200"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar p-3"
      >
        {isLoading
          ? Array.from({ length: 20 }).map((_, index) => (
              <SkeletonItem key={index} />
            ))
          : listCategory.map((category) => (
              <div
                key={category.id}
                className="w-[120px] flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-md shadow-md border-t"
              >
                <div className="w-20 h-20 relative">
                  <Image
                    src={category.imageUrl || IconNotFound}
                    alt={category.name}
                    fill
                    className="object-cover rounded-full shadow-md"
                  />
                </div>
                <p className="text-sm w-full text-center truncate">
                  {category.name}
                </p>
              </div>
            ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md p-1 rounded-full hover:bg-gray-200"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ListCategoryComponent;
