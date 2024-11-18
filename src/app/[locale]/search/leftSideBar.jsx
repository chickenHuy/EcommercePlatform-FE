"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export default function ModernLeftSideBar() {
  const categories = [
    {
      id: "electronics",
      name: "Electronics",
      children: [
        { id: "smartphones", name: "Smartphones" },
        { id: "laptops", name: "Laptops" },
        { id: "accessories", name: "Accessories" },
      ],
    },
    {
      id: "clothing",
      name: "Clothing",
      children: [
        { id: "mens", name: "Men's" },
        { id: "womens", name: "Women's" },
        { id: "kids", name: "Kids" },
      ],
    },
  ];

  const brands = [
    { id: "hyperx", label: "HyperX" },
    { id: "razer", label: "Razer" },
    { id: "logitech", label: "Logitech" },
    { id: "shure", label: "Shure" },
    { id: "singing-machine", label: "The singing machine" },
    { id: "singing-machine", label: "The singing machine" },
    { id: "singing-machine", label: "The singing machine" },
    { id: "singing-machine", label: "The singing machine" },
    { id: "singing-machine", label: "The singing machine" },
    { id: "singing-machine", label: "The singing machine" },
    { id: "singing-machine", label: "The singing machine" },
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 m-4 max-w-sm"
    >
      <div className="bg-blue-primary rounded-xl p-6 space-y-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="categories">
            <AccordionTrigger className="text-lg font-semibold text-gray-700">
              Danh mục
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-72 w-full pr-4">
                <RadioGroup
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                >
                  {categories.map((category) => (
                    <div key={category.id} className="mb-4">
                      <h3 className="text-md font-medium text-gray-600 mb-2">
                        {category.name}
                      </h3>
                      {category.children.map((subCategory) => (
                        <div
                          key={subCategory.id}
                          className="flex items-center space-x-2 ml-4 mb-2"
                        >
                          <RadioGroupItem
                            value={subCategory.id}
                            id={subCategory.id}
                          />
                          <Label
                            htmlFor={subCategory.id}
                            className="text-sm text-gray-500"
                          >
                            {subCategory.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  ))}
                </RadioGroup>
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
                  <label
                    htmlFor={brand.id}
                    className="text-sm text-gray-500 cursor-pointer"
                  >
                    {brand.label}
                  </label>
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
              <motion.div
                key={star}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleStarClick(star)}
                className="cursor-pointer"
              >
                <Star
                  className={
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }
                  size={24}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <Separator className="bg-black-tertiary opacity-20" />

        <Button className="w-full text-white-primary bg-black-primary hover:bg-black-tertiary transition-colors duration-200">
          Áp dụng bộ lọc
        </Button>
      </div>
    </motion.div>
  );
}
