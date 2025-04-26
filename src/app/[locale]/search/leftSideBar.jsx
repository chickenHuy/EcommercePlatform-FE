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
import {
  resetFilters,
  setMainCategoryId,
  setMaxPrice,
  setMinPrice,
  setBrands as setSelectedBrands,
  setRating as setSelectedRating,
  setCategories as setSelectedCategories,
} from "@/store/features/userSearchSlice";

export default function ModernLeftSideBar({t}) {
  const [categories, setCategories] = React.useState([]);
  const [brands, setBrands] = React.useState([]);
  const [isLoadingBrands, setIsLoadingBrands] = React.useState(true);
  const minPrice = useSelector((state) => state.searchFilter.minPrice);
  const maxPrice = useSelector((state) => state.searchFilter.maxPrice);
  const dispatch = useDispatch();
  const selectedBrands = useSelector((state) =>
    Array.isArray(state.searchFilter.brands) ? state.searchFilter.brands : []
  );
  const ratings = [5, 4, 3, 2, 1];
  const selectedRating = useSelector((state) => state.searchFilter.rating);

  const handlePriceChange = (value) => {
    dispatch(setMinPrice(value[0]));
    dispatch(setMaxPrice(value[1]));
  };

  const handleRatingClick = (star) => {
    dispatch(setSelectedRating(star));
  };

  const selectedCategory = useSelector(
    (state) => state.searchFilter.mainCategoryId
  );

  React.useEffect(() => {
    console.log(selectedCategory + " HAA");
  }, [selectedCategory]);

  const handleBrandChange = (brand, checked) => {
    checked
      ? dispatch(setSelectedBrands([...selectedBrands, brand]))
      : dispatch(
          setSelectedBrands(selectedBrands.filter((item) => item !== brand))
        );
  };

  const getChildCategoryIds = (categories, categoryId) => {
    let result = [categoryId];

    const findCategoryAndCollectChildren = (categoryList, targetId) => {
      for (const category of categoryList) {
        if (category.id === targetId) {
          if (category.children) {
            collectChildIds(category.children);
          }
          break;
        } else if (category.children && category.children.length > 0) {
          findCategoryAndCollectChildren(category.children, targetId);
        }
      }
    };

    const collectChildIds = (children) => {
      for (const child of children) {
        result.push(child.id); // Thêm id con vào danh sách
        if (child.children && child.children.length > 0) {
          collectChildIds(child.children); // Đệ quy với các danh mục con tiếp theo
        }
      }
    };

    findCategoryAndCollectChildren(categories, categoryId);

    return result;
  };

  const handleCategoryChange = (categoryId) => {
    dispatch(setMainCategoryId(categoryId));
    const rs = getChildCategoryIds(categories, categoryId);
    dispatch(setSelectedCategories(rs));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

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

  const handleDeleteFilter = () => {
    dispatch(resetFilters());
  };

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
              {t("text_category")}
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
            {t("text_brand")}
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
                      checked={selectedBrands.includes(brand.id)}
                      onCheckedChange={(checked) =>
                        handleBrandChange(brand.id, checked)
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
          <h3 className="text-lg font-semibold text-black-primary">{t("text_sale_price")}</h3>
          <Slider
            value={[minPrice, maxPrice ? maxPrice : 99999999]}
            onValueChange={(value) => handlePriceChange(value)}
            min={0}
            max={99999999}
            step={100000}
            className="w-full text-black-primary"
          />
          <div className="flex justify-between text-sm">
            <span className="font-extralight text-black-primary">
              {formatCurrency(minPrice)}
            </span>
            <span className="font-extralight text-black-primary">-</span>
            <span className="font-extralight text-black-primary">
              {formatCurrency(maxPrice ? maxPrice : 99999999)}
            </span>
          </div>
        </div>

        <Separator className="bg-black-tertiary opacity-20" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-black-primary">{t("text_review")}</h3>
          <div className="space-y-2">
            {ratings.map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingClick(rating)}
                className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md transition-colors hover:bg-gray-primary/50 ${
                  selectedRating === rating ? "bg-gray-primary/90" : ""
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
                  {rating == 5 ? "" : t("text_upward")}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Separator className="bg-black-tertiary opacity-20" />

        <Button
          className="w-full text-white-primary bg-red-primary hover:bg-red-primary/50 transition-colors duration-200"
          onClick={() => handleDeleteFilter()}
        >
          {t("text_clear_all")}
        </Button>
      </div>
    </div>
  );
}
