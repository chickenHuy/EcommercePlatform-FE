import Image from "next/image";
import ProductPlaceHolder from "@/assets/images/productPlaceholder.png";
import { getProductTop3 } from "@/api/search/searchApi";
import { useEffect, useCallback, useState } from "react";
import Link from "next/link";

export function SuggestedProducts({ storeId, t }) {
  const [products, setProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProductTop3 = useCallback(async () => {
    try {
      setIsLoading(true);
      if (storeId != null) {
        const response = await getProductTop3(storeId);
        setProducts(response.result);
      }
    } catch (error) {
      console.log("Error get store: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchProductTop3();
  }, [fetchProductTop3]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="skeleton-line flex flex-col gap-3 p-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="skeleton-item h-24 w-full">
          </div>
        ))}
      </div>
    );
  }

  return (
    storeId && (
      <div className="flex flex-col gap-3 py-3 px-2 rounded-md border bg-blue-secondary animate-fade-in">
        <h3 className="text-[1em] font-[900] text-center w-full">
          {t("text_suggest_for_you")}
        </h3>
        <div className="flex flex-col gap-3">
          {products && products.length > 0 ? (
            products.map((product) => (
              <Link
                href={product.slug}
                key={product.id}
                className="bg-white-primary border rounded-md shadow-md hover:scale-[1.02] transition"
              >
                <div className="w-full flex flex-row flex-wrap items-center justify-center gap-3 px-3 py-2">
                  <Image
                    src={
                      product.mainImageUrl
                        ? product.mainImageUrl
                        : ProductPlaceHolder
                    }
                    alt={product.name}
                    width={100}
                    height={100}
                    className="rounded-md flex-1 aspect-square object-cover border shadow-md"
                  />

                  <div className="flex-1 w-1/2">
                    <h4 className="text-[1em] w-full truncate">
                      {product.name}
                    </h4>
                    <div className="text-[.9em] border px-2 rounded-sm w-fit h-fit">
                      {product.brandName}
                    </div>
                    <div className="mt-1">
                      <span className="block text-[.8em] text-muted-foreground line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                      <span className="block text-[1em] font-[900] text-red-primary">
                        {formatCurrency(product.salePrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="w-full flex items-center justify-center">
              <Image
                src={ProductPlaceHolder}
                alt={t("text_product_photo")}
                width={200}
                height={200}
                className="rounded-md object-cover mb-4"
              />
            </div>
          )}
        </div>
      </div>
    )
  );
}
