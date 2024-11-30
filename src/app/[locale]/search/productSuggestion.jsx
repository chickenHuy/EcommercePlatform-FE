import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProductPlaceHolder from "@/assets/images/productPlaceholder.png";

export function SuggestedProducts() {
  const products = [
    {
      id: "1",
      brand: "Apple",
      name: "MacBook Pro",
      image: "",
      originalPrice: 69990000,
      discountedPrice: 65990000,
    },
    {
      id: "2",
      brand: "Microsoft",
      name: "Surface Laptop Studio",
      image: "",
      originalPrice: 54990000,
      discountedPrice: 49990000,
    },
    {
      id: "3",
      brand: "LG",
      name: "Gram 17Z90P",
      image: "",
      originalPrice: 42990000,
      discountedPrice: 38990000,
    },
  ];

  // Hàm định dạng tiền tệ Việt Nam Đồng
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-black-primary">
        Sản phẩm đề xuất
      </h3>
      <div className="space-y-3">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground">
                    {product.brand}
                  </div>
                  <h4 className="text-sm font-medium truncate">
                    {product.name}
                  </h4>
                  <div className="mt-1">
                    <span className="block text-xs text-muted-foreground line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                    <span className="block text-lg font-semibold text-black-primary">
                      {formatCurrency(product.discountedPrice)}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <Image
                    src={product.image ? product.image : ProductPlaceHolder}
                    alt={product.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
