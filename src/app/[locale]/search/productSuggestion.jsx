import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import ProductPlaceHolder from "@/assets/images/productPlaceholder.png";
import { Star } from "lucide-react";
import { Label } from "@/components/ui/label";
import { getProductTop3 } from "@/api/search/searchApi";
import { useSelector } from "react-redux";
import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";

export function SuggestedProducts() {
  const storeId = useSelector((state) => state.searchFilter.store);
  const [products, setProducts] = useState(null);
  const router = useRouter();

  const fetchProductTop3 = useCallback(async () => {
    try {
      const response = await getProductTop3(storeId);
      setProducts(response.result);
    } catch (error) {
      console.log("Error get store: ", error);
    }
  }, [storeId]);

  const handleOnClickCard = (slug) => {
    router.push(`/${slug}`);
  };

  useEffect(() => {
    fetchProductTop3();
  }, [fetchProductTop3]);

  // Hàm định dạng tiền tệ Việt Nam Đồng
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-black-primary ml-4">
        Gợi ý cho bạn
      </h3>
      <div className="space-y-3">
        {products && products.length > 0 ? (
          products.map((product) => (
            <Card
              key={product.id}
              className="ml-2 mr-2 overflow-hidden hover:cursor-pointer hover:scale-105 hover:transition-transform hover:duration-300"
              onClick={() => {
                handleOnClickCard(product.slug);
              }}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1 ml-4">
                    <div className="text-xs text-muted-foreground">
                      {product.brandName}
                    </div>
                    <h4 className="text-sm font-medium truncate hover:whitespace-normal">
                      {product.name}
                    </h4>
                    <div className="mt-1">
                      <span className="block text-xs text-muted-foreground line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                      <span className="block text-lg font-semibold text-black-primary">
                        {formatCurrency(product.salePrice)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star
                        className="text-yellow-primary hover:cursor-default"
                        size={20}
                      />
                      <Label className="text-xs">{product.rating || 0}</Label>
                    </div>
                  </div>
                  <div className="shrink-0 mr-2">
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
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="w-full flex items-center justify-center">
            <Image
              src={ProductPlaceHolder}
              alt="ảnh sản phẩm"
              width={200}
              height={200}
              className="rounded-md object-cover mb-4"
            />
          </div>
        )}
      </div>
    </div>
  );
}
