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
import RenderCategories from "./renderCategories";
import Image from "next/image";
import { getBrands, getCategoriesWithTreeView } from "@/api/search/searchApi";
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
import { useSearchParams } from "next/navigation";

export default function ModernLeftSideBar({ t }) {
  const [categories, setCategories] = React.useState(null);
  const [brands, setBrands] = React.useState([]);
  const [isLoadingBrands, setIsLoadingBrands] = React.useState(true);
  const searchParam = useSearchParams();
  const minPrice = useSelector((state) => state.searchFilter.minPrice);
  const maxPrice = useSelector((state) => state.searchFilter.maxPrice);
  const dispatch = useDispatch();
  const selectedBrands = useSelector((state) =>
    Array.isArray(state.searchFilter.brands) ? state.searchFilter.brands : [],
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
    (state) => state.searchFilter.mainCategoryId,
  );

  React.useEffect(() => {
    dispatch(resetFilters());
  }, []);

  React.useEffect(() => {
    if (!categories) return;

    const brandIdFromURL = Number(searchParam.get("brandId")) || null;
    const categoryIdFromURL = Number(searchParam.get("categoryId")) || null;

    if (brandIdFromURL && !selectedBrands.includes(brandIdFromURL)) {
      dispatch(setSelectedBrands([brandIdFromURL]));
    }

    if (categoryIdFromURL) {
      const categoryIdNumber = parseInt(categoryIdFromURL, 10);
      dispatch(setMainCategoryId(categoryIdNumber));
      const childCategoryIds = getChildCategoryIds(
        categories,
        categoryIdNumber,
      );
      dispatch(setSelectedCategories(childCategoryIds));
    }
  }, [categories]);

  const handleBrandChange = (brand, checked) => {
    checked
      ? dispatch(setSelectedBrands([...selectedBrands, brand]))
      : dispatch(
          setSelectedBrands(selectedBrands.filter((item) => item !== brand)),
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
        result.push(child.id);
        if (child.children && child.children.length > 0) {
          collectChildIds(child.children);
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
        <div key={index} className="flex items-center gap-2">
          <div className="skeleton-item h-7 flex-grow"></div>
          <div className="skeleton-circle h-7 w-7"></div>
        </div>
      ))}
    </div>
  );

  const CategoriesSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="skeleton-item h-7 w-full"></div>
      ))}
    </div>
  );

  return (
    <div className="bg-blue-tertiary rounded-lg border py-5 px-2 space-y-6 w-full min-h-full">
      <Accordion
        type="single"
        collapsible
        defaultValue="categories"
        className="w-full"
      >
        <AccordionItem value="categories">
          <AccordionTrigger className="text-[1em] font-[900] hover:no-underline py-1 px-2 my-2 rounded-md hover:bg-blue-primary">
            {t("text_category")}
          </AccordionTrigger>
          <AccordionContent>
            {categories ? (
              <ScrollArea className="h-72 w-full px-1 py-1 rounded-md border animate-fade-in">
                {RenderCategories(
                  categories,
                  0,
                  handleCategoryChange,
                  selectedCategory,
                )}
              </ScrollArea>
            ) : (
              <CategoriesSkeleton />
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div>
        <h3 className="text-[1em] font-[900] hover:no-underline py-1 px-2 my-2">
          {t("text_brand")}
        </h3>
        <ScrollArea className="h-72 w-full px-1 py-1 rounded-md border">
          {isLoadingBrands ? (
            <BrandsSkeleton />
          ) : (
            <div className="px-2 py-1 animate-fade-in">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex flex-row justify-start items-center gap-2 hover:bg-blue-primary p-1 rounded-md"
                >
                  <Checkbox
                    id={brand.id}
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={(checked) =>
                      handleBrandChange(brand.id, checked)
                    }
                  />
                  <span htmlFor={brand.id} className="text-[.9em] flex-grow">
                    {brand.name}
                  </span>
                  <Image
                    src={brand.logoUrl || BrandEmpty}
                    alt={`${brand.name} logo`}
                    width={30}
                    height={30}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <Separator className="bg-black-tertiary opacity-20" />

      <div className="space-y-4">
        <h3 className="text-[1em] font-[900] hover:no-underline py-1 px-2 my-2">
          {t("text_sale_price")}
        </h3>
        <Slider
          value={[minPrice, maxPrice ? maxPrice : 99999999]}
          onValueChange={(value) => handlePriceChange(value)}
          min={0}
          max={99999999}
          step={100000}
          className="w-full animate-fade-in"
        />
        <div className="flex justify-between text-[.9em]">
          <span>{formatCurrency(minPrice)}</span>
          <span>-</span>
          <span>{formatCurrency(maxPrice ? maxPrice : 99999999)}</span>
        </div>
      </div>

      <Separator className="bg-black-tertiary opacity-20" />

      <div className="space-y-4">
        <h3 className="text-[1em] font-[900] py-1 px-2 my-2">
          {t("text_review")}
        </h3>
        <div className="space-y-2 animate-fade-in">
          {ratings.map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingClick(rating)}
              className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md transition-colors hover:bg-blue-primary ${
                selectedRating === rating ? "bg-blue-primary" : ""
              }`}
            >
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${
                      index < rating
                        ? "text-yellow-primary fill-yellow-primary"
                        : "text-gray-primary"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[.9em]">
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
  );
}
