"use client";

import Image from "next/image";
import { useState } from "react";
import { Star, ShoppingCart, Heart, Minus, Plus, Store } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductSpecifications } from "./product-specifications";
import StoreEmpty from "@/assets/images/storeEmpty.jpg";
import { Reviews } from "./reviewPage";
import { ProductMediaViewer } from "./product-media-viewer";

export default function ProductDetail({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);

  const handleAttributeSelect = (attributeName, value) => {
    setSelectedAttributes((prev) => ({ ...prev, [attributeName]: value }));

    const matchingVariant = product.variants.find((variant) =>
      variant.values.every((v) =>
        v.attribute === attributeName
          ? v.value === value
          : selectedAttributes[v.attribute] === v.value
      )
    );

    setSelectedVariant(matchingVariant || null);
  };

  const updateQuantity = (change) => {
    setQuantity((prev) =>
      Math.max(1, Math.min(prev + change, product.quantity))
    );
  };

  const currentPrice = selectedVariant?.salePrice || product.salePrice;
  const currentOriginalPrice =
    selectedVariant?.originalPrice || product.originalPrice;

  return (
    <div className="flex-col bg-opacity-60 bg-blue-primary">
      <div className="mx-auto px-4 h-1 bg-blue-primary w-3/4"></div>
      <div className="mx-auto px-4 bg-white-primary mt-20 w-3/4">
        <div className="grid gap-8 md:grid-cols-2 mt-2">
          <ProductMediaViewer product={product} />
          <div className="space-y-6 mt-2">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= (product.rating || 0)
                          ? "text-yellow-primary fill-current"
                          : "text-gray-secondary"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.reviewCount} đánh giá)
                </span>
                <span className="text-sm text-gray-500">
                  Đã bán {product.soldCount || 0}
                </span>
              </div>
            </div>

            <Separator className="my-8" />

            <div className="rounded-lg bg-white-secondary p-4">
              <div className="font-light">{product.description}</div>
            </div>

            <div className="rounded-lgp-4">
              <span className="text-3xl font-bold text-red-primary">
                {currentPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
              {currentOriginalPrice > currentPrice && (
                <span className="ml-2 text-sm text-black-tertiary line-through">
                  {currentOriginalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              )}
            </div>

            {product.attributes.map((attribute) => (
              <div key={attribute.id}>
                <h3 className="font-semibold">{attribute.name}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {attribute.values.map((value) => (
                    <Button
                      key={value.id}
                      variant={
                        selectedAttributes[attribute.name] === value.value
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        handleAttributeSelect(attribute.name, value.value)
                      }
                    >
                      {value.value}
                    </Button>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <h3 className="font-semibold">Số lượng</h3>
              <div className="mt-2 flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(-1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-black-tertiary">
                  {product.quantity} sản phẩm có sẵn
                </span>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button className="flex-1 bg-red-primary bg-opacity-90" size="lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Thêm vào giỏ hàng
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
            <Separator className="my-8" />
          </div>
        </div>
      </div>
      <Separator className="my-8" />

      <div className="mx-auto px-4 bg-blue-primary rounded-lg">
        <div className="bg-blue-primary border-none">
          <div className="p-4 w-3/4 mx-auto text-center">
            <h2 className="text-2xl font-bold">Thông tin cửa hàng</h2>
            <div className="mt-4 flex mx-auto w-fit items-center space-x-4">
              <Image
                src={
                  product.store.imageUrl ? product.store.imageUrl : StoreEmpty
                }
                alt={product.store.name}
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold">{product.store.name}</h3>
                <p className="text-sm text-black-tertiary">
                  Đánh giá: {product.store.rating?.toFixed(1)}/5.0
                </p>
              </div>
              <Button className="mt-4 mr-auto" variant="outline">
                <Store className="mr-2"></Store>
                Xem shop
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto px-4 rounded-lg w-3/4">
        <Separator className="my-8" />
        <div className="bg-white-primary">
          <div className="p-6">
            <h2 className="text-2xl font-bold">CHI TIẾT SẢN PHẨM</h2>
            <div
              className="prose mt-4 max-w-none"
              dangerouslySetInnerHTML={{ __html: product.details }}
            />
          </div>
          <ProductSpecifications components={product.components || []} />
        </div>

        <Separator className="my-8" />

        <div className="mx-auto px-4 bg-white-primary">
          <Reviews />
        </div>
      </div>
    </div>
  );
}
