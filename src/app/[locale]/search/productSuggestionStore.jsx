import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import Image from "next/image";
import ProductPlaceHolder from "@/assets/images/productPlaceholder.png";

export function StoreSuggestedProducts() {
  const products = [
    {
      id: "1",
      mainImageUrl:
        "http://res.cloudinary.com/dftaajyn6/image/upload/v1732848701/list_image_product/gfqxov6yifhrxsrujxeb.jpg",
      brand: "MSI",
      name: "LAPTOP MSI GAMING GF64",
      originalPrice: "30.000.000 đ",
      salePrice: "27.490.000 đ",
      rating: 4.5,
    },
    {
      id: "2",
      mainImageUrl:
        "http://res.cloudinary.com/dftaajyn6/image/upload/v1732848701/list_image_product/gfqxov6yifhrxsrujxeb.jpg",
      brand: "iPhone",
      name: "IPhone 16 Promax 1TB",
      originalPrice: "50.000.000 đ",
      salePrice: "45.490.000 đ",
      rating: 4.7,
    },
    {
      id: "3",
      mainImageUrl:
        "http://res.cloudinary.com/dftaajyn6/image/upload/v1732848701/list_image_product/gfqxov6yifhrxsrujxeb.jpg",
      brand: "Samsung",
      name: "Samsung galaxy S20 FE",
      originalPrice: "10.000.000 đ",
      salePrice: "8.490.000 đ",
      rating: 4,
    },
  ];

  return (
    <div className="space-y-4">
      <Label className="font-semibold text-lg text-black-primary">
        Gợi ý cho bạn
      </Label>
      {products.map((product) => (
        <Card
          key={product.id}
          className="hover:cursor-pointer hover:scale-105 hover:transition-transform hover:duration-300"
        >
          <CardContent className="flex items-center justify-between p-3">
            <div className="w-2/3 flex flex-col hover:cursor-pointer">
              <Label className="truncate text-muted-foreground text-xs">
                {product.brand}
              </Label>
              <Label className="truncate text-sm hover:cursor-pointer">
                {product.name}
              </Label>
              <Label className="line-through text-muted-foreground truncate">
                {product.originalPrice}
              </Label>
              <Label className="truncate text-lg">{product.salePrice}</Label>
              <div className="flex items-center space-x-1">
                <Star
                  className="text-yellow-primary hover:cursor-default"
                  size={20}
                />
                <Label className="text-xs">{product.rating}</Label>
              </div>
            </div>
            <div className="w-1/3 items-end justify-end">
              <Image
                src={
                  product.mainImageUrl
                    ? product.mainImageUrl
                    : ProductPlaceHolder
                }
                alt={product.name}
                width={80}
                height={80}
                className="rounded-md object-cover"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
