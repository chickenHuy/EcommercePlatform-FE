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

export default function ModernLeftSideBar() {
  const categories = [
    {
      id: "electronics",
      name: "Electronics",
      children: [
        {
          id: "computers",
          name: "Computers",
          children: [
            { id: "laptops", name: "Laptops" },
            { id: "desktops", name: "Desktops" },
            { id: "tablets", name: "Tablets" },
          ],
        },
        {
          id: "smartphones",
          name: "Smartphones",
          children: [
            { id: "android", name: "Android" },
            { id: "ios", name: "iOS" },
          ],
        },
        { id: "accessories", name: "Accessories" },
      ],
    },
    {
      id: "clothing",
      name: "Clothing",
      children: [
        {
          id: "mens",
          name: "Men's",
          children: [
            { id: "shirts", name: "Shirts" },
            { id: "pants", name: "Pants" },
            { id: "shoes", name: "Shoes" },
          ],
        },
        {
          id: "womens",
          name: "Women's",
          children: [
            { id: "dresses", name: "Dresses" },
            { id: "tops", name: "Tops" },
            { id: "shoes", name: "Shoes" },
          ],
        },
        { id: "kids", name: "Kids" },
      ],
    },
  ];

  const brands = [
    {
      id: "hyperx",
      label: "HyperX",
      logo: "",
    },
    { id: "razer", label: "Razer", logo: "" },
    {
      id: "logitech",
      label: "Logitech",
      logo: "",
    },
    { id: "shure", label: "Shure", logo: "" },
    {
      id: "singing-machine",
      label: "The singing machine",
      logo: "",
    },
  ];

  const [priceRange, setPriceRange] = React.useState([0, 999999999]);
  const [rating, setRating] = React.useState(0);
  const [selectedCategory, setSelectedCategory] = React.useState("");

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

  return (
    <div className="space-y-8 m-4 max-w-sm">
      <div className="bg-blue-primary rounded-xl p-4 space-y-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="categories">
            <AccordionTrigger className="text-lg font-semibold text-gray-700">
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
          <h3 className="text-lg font-semibold text-gray-700">Thương hiệu</h3>
          <ScrollArea className="h-48 w-full pr-4">
            <div className="space-y-3">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox id={brand.id} />
                  <div className="flex justify-between space-x-2 w-full">
                    <Label
                      htmlFor={brand.id}
                      className="text-sm text-gray-500 cursor-pointer"
                    >
                      {brand.label}
                    </Label>
                    <Image
                      src={brand.logo || BrandEmpty}
                      alt={`${brand.label} logo`}
                      width={24}
                      height={24}
                      className="object-contain left-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator className="bg-black-tertiary opacity-20" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Giá bán</h3>
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            min={0}
            max={999999999}
            step={100000}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span className="font-extralight">
              {formatCurrency(priceRange[0])}
            </span>
            <span className="font-extralight">-</span>
            <span className="font-extralight">
              {formatCurrency(priceRange[1])}
            </span>
          </div>
        </div>

        <Separator className="bg-black-tertiary opacity-20" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Đánh giá</h3>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                onClick={() => handleStarClick(star)}
                className="cursor-pointer"
              >
                <Star
                  className={
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }
                  size={24}
                />
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-black-tertiary opacity-20" />

        <Button className="w-full text-white-primary bg-black-primary hover:bg-black-tertiary transition-colors duration-200">
          Áp dụng bộ lọc
        </Button>
      </div>
    </div>
  );
}
