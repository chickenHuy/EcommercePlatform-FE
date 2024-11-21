"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BrandEmpty from "@/assets/images/brandEmpty.jpg";
import { Label } from "@/components/ui/label";
import RenderCategories from "./renderCategories";
import Image from "next/image";
import { getBrands, getCategoriesWithTreeView } from "@/api/search/searchApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { setBrands as setSelectedBrands } from "@/store/features/userSearchSlice";

export default function ModernLeftSideBar() {
  const [categories, setCategories] = React.useState([]);
  const [brands, setBrands] = React.useState([]);
  const [isLoadingBrands, setIsLoadingBrands] = React.useState(true);

  React.useEffect(() => {
    getCategoriesWithTreeView()
      .then((response) => {
        setCategories(response.result);
      })
      .catch((error) => {
        setCategories([]);
      });

    setIsLoadingBrands(true);
    getBrands()
      .then((response) => {
        setBrands(response.result);
      })
      .catch((error) => {
        setBrands([]);
      });
    setIsLoadingBrands(false);
  }, []);

  const [priceRange, setPriceRange] = React.useState([0, 999999999]);
  const [rating, setRating] = React.useState(0);
  const [selectedCategory, setSelectedCategory] = React.useState("");

  const dispatch = useDispatch();
  const selectedBrands = useSelector((state) =>
    Array.isArray(state.searchFilter.brands) ? state.searchFilter.brands : []
  );

  const handleBrandChange = (brand, checked) => {
    checked ? (
      dispatch(setSelectedBrands([...selectedBrands,brand]))
    ) :
    (
      dispatch(setSelectedBrands(selectedBrands.filter((item) => item !== brand)))
    )
  
    console.log(selectedBrands)
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const [selectedRating, setSelectedRating] = React.useState(0);

  const ratings = [5, 4, 3, 2, 1];

  const BrandsSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <div className="flex justify-between space-x-2 w-full">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-6" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 m-4 max-w-sm">
      <div className="bg-blue-primary rounded-xl p-4 space-y-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="categories">
            <AccordionTrigger className="text-lg font-semibold text-black-primary">
              Danh mục
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-72 w-full pr-4">
                {RenderCategories(
                  categories,
                  0,
                  handleCategoryChange,
                  selectedCategory
                )}
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-black-primary">
            Thương hiệu
          </h3>
          <ScrollArea className="h-48 w-full pr-4">
            {isLoadingBrands ? (
              <BrandsSkeleton />
            ) : (
              <div className="space-y-3">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand.id}
                      onCheckedChange={
                        (checked) => handleBrandChange(brand.id, checked)
                      }
                    />

                    <div className="flex justify-between space-x-2 w-full">
                      <Label
                        htmlFor={brand.id}
                        className="text-sm text-black-primary cursor-pointer"
                      >
                        {brand.name}
                      </Label>
                      <Image
                        src={brand.logoUrl || BrandEmpty}
                        alt={`${brand.name} logo`}
                        width={24}
                        height={24}
                        className="object-contain left-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <Separator className="bg-black-tertiary opacity-20" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-black-primary">Giá bán</h3>
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            min={0}
            max={999999999}
            step={100000}
            className="w-full text-black-primary"
          />
          <div className="flex justify-between text-sm">
            <span className="font-extralight text-black-primary">
              {formatCurrency(priceRange[0])}
            </span>
            <span className="font-extralight text-black-primary">-</span>
            <span className="font-extralight text-black-primary">
              {formatCurrency(priceRange[1])}
            </span>
          </div>
        </div>

        <Separator className="bg-black-tertiary opacity-20" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-black-primary">Đánh Giá</h3>
          <div className="space-y-2">
            {ratings.map((rating) => (
              <button
                key={rating}
                onClick={() => setSelectedRating(rating)}
                className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md transition-colors hover:text-gray-primary ${
                  selectedRating === rating ? "text-black-primary" : ""
                }`}
              >
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-5 h-5 ${
                        index < rating
                          ? "text-yellow-primary fill-white-primary"
                          : "text-gray-primary"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-light text-black-primary">
                  {rating == 5 ? "" : "trở lên"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Separator className="bg-black-tertiary opacity-20" />

        <Button className="w-full text-white-primary bg-red-primary hover:bg-red-primary/50 transition-colors duration-200">
          Xoá tất cả
        </Button>
      </div>
    </div>
  );
}
