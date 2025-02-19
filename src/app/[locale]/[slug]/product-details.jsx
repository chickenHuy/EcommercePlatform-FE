"use client";

import Image from "next/image";
import { useEffect, useState, Suspense, lazy } from "react";
import { Star, ShoppingCart, Heart, Minus, Plus, Store } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ProductSpecifications } from "./product-specifications";
import StoreEmpty from "@/assets/images/storeEmpty.jpg";
import { ProductMediaViewer } from "./product-media-viewer";
import { addToCart } from "@/api/cart/addToCart";
import { Toaster } from "@/components/ui/toaster";
import { useDispatch, useSelector } from "react-redux";
import { changeQuantity } from "@/store/features/cartSlice";
import { useRouter } from "next/navigation";
import { setStore } from "@/store/features/userSearchSlice";
import { get, post } from "@/lib/httpClient";
import { setWishList } from "@/store/features/wishListSlice";
import Loading from "@/components/loading";
import { useToast } from "@/hooks/use-toast";
import ProductDetailSuggestions from "./product-detail-suggestions";

const ReviewLazy = lazy(() => import("./reviewPage"));

export default function ProductDetail({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [availableOptions, setAvailableOptions] = useState({});
  const { toast } = useToast();

  const initializeAvailableOptions = () => {
    const initialOptions = {};
    product.attributes.forEach((attr) => {
      initialOptions[attr.name] = new Set(attr.values.map((v) => v.value));
    });
    setAvailableOptions(initialOptions);
  };

  useEffect(() => {
    initializeAvailableOptions();
  }, []);

  const getValidVariants = (attributes) => {
    return product.variants.filter((variant) =>
      Object.entries(attributes).every(([attr, val]) =>
        variant.values.some((v) => v.attribute === attr && v.value === val)
      )
    );
  };

  const handleAttributeSelect = (attributeName, value) => {
    const newSelectedAttributes = {
      ...selectedAttributes,
      [attributeName]: value,
    };
    setSelectedAttributes(newSelectedAttributes);

    const validVariants = getValidVariants(newSelectedAttributes);

    const newAvailableOptions = { ...availableOptions };
    product.attributes.forEach((attr) => {
      if (attr.name !== attributeName) {
        newAvailableOptions[attr.name] = new Set(
          validVariants.flatMap((v) =>
            v.values
              .filter((val) => val.attribute === attr.name)
              .map((val) => val.value)
          )
        );
      } else {
        newAvailableOptions[attr.name] = new Set(
          attr.values.map((v) => v.value)
        );
      }
    });
    setAvailableOptions(newAvailableOptions);

    if (
      Object.keys(newSelectedAttributes).length === product.attributes.length
    ) {
      const exactMatch = validVariants.find((v) =>
        v.values.every(
          (val) => newSelectedAttributes[val.attribute] === val.value
        )
      );
      setSelectedVariant(exactMatch || null);

      if (exactMatch && quantity > exactMatch.quantity) {
        setQuantity(exactMatch.quantity);
      }
    } else {
      setSelectedVariant(null);
    }
  };

  const updateQuantity = (change) => {
    const maxQuantity = selectedVariant
      ? selectedVariant.quantity
      : product.quantity;
    setQuantity((prev) => Math.max(1, Math.min(prev + change, maxQuantity)));
  };

  const currentPrice = selectedVariant?.salePrice || product.salePrice;
  const currentOriginalPrice =
    selectedVariant?.originalPrice || product.originalPrice;

  const isAttributeDisabled = (attributeName, value) => {
    if (Object.keys(selectedAttributes).length === 0) return false;

    const testAttributes = { ...selectedAttributes, [attributeName]: value };
    return getValidVariants(testAttributes).length === 0;
  };

  const dispatch = useDispatch();
  const oldQuantity = useSelector((state) => state.cartReducer.count);

  const addProductToCart = async () => {
    const request = {
      productId: product.id,
      variantId: selectedVariant?.id ? selectedVariant.id : "",
      quantity: quantity,
    };

    console.log(request);
    try {
      const rs = await addToCart(request);
      const qty = oldQuantity + quantity;
      dispatch(changeQuantity(qty));
      toast({
        title: "Sản phẩm đã được thêm vào giỏ hàng",
        description:
          "Bạn có thể xem giỏ hàng bằng cách nhấn vào biểu tượng giỏ hàng ở góc trên bên phải",
      });
    } catch (error) {
      toast({
        title: "Thêm sản phẩm thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLoveProduct = async () => {
    try {
      await post(`/api/v1/users/follow/${product.id}`);
      toast({
        title: "Đã thêm sản phẩm vào danh sách yêu thích",
        description: "Bạn có thể xem danh sách yêu thích ở thanh menu",
      });

      get(`/api/v1/users/listFollowedProduct`)
        .then((res) => {
          dispatch(setWishList(res.result));
        })
        .catch((err) => {
          dispatch(setWishList([]));
        });
    } catch (error) {
      toast({
        title: "Thêm sản phẩm vào danh sách yêu thích thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const router = useRouter();
  const handleOnClickViewShop = (storeId) => {
    dispatch(setStore(storeId));
    router.push("/search");
  };

  return (
    <div className="flex-col bg-opacity-60 bg-blue-primary">
      <Toaster />
      <div className="mx-auto px-4 h-1 bg-blue-primary w-3/4"></div>
      <div className="mx-auto px-4 bg-white-primary mt-20 w-3/4">
        <div className="grid gap-8 md:grid-cols-2 mt-2">
          <ProductMediaViewer product={product} />
          <div
            className={
              `space-y-6 mt-2` + product.quantity === 0
                ? "opacity-50 pointer-events-none relative"
                : ""
            }
          >
            {product.quantity === 0 && (
              <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
                <div className="bg-red-primary text-white-primary font-bold text-3xl py-1 px-3 rounded-lg shadow-md transform rotate-45">
                  SOLD OUT
                </div>
              </div>
            )}

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
                      disabled={isAttributeDisabled(
                        attribute.name,
                        value.value
                      )}
                    >
                      {value.value}
                    </Button>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-1">
              <h3 className="font-semibold">Số lượng</h3>
              <div className="mt-2 flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(1)}
                  disabled={
                    quantity >= (selectedVariant?.quantity || product.quantity)
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-black-tertiary">
                  {selectedVariant
                    ? selectedVariant.quantity
                    : product.quantity}{" "}
                  sản phẩm có sẵn
                </span>
              </div>
            </div>

            <div className="flex space-x-4 mt-2">
              <Button
                className="flex-1 bg-red-primary bg-opacity-90"
                size="lg"
                disabled={!selectedVariant && product.variants.length > 0}
                onClick={() => addProductToCart()}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Thêm vào giỏ hàng
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleLoveProduct()}
              >
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
                {product.store.rating ? (
                  <p className="text-sm text-black-tertiary">
                    Đánh giá: {product.store.rating?.toFixed(1)}/5.0
                  </p>
                ) : (
                  "(0 đánh giá)"
                )}
              </div>
              <Button
                className="mt-4 mr-auto"
                variant="outline"
                onClick={() => handleOnClickViewShop(product.store.id)}
              >
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

        <ProductDetailSuggestions productId={product.id} />

        <div className="mx-auto px-4 bg-white-primary">
          <Suspense fallback={<Loading></Loading>}>
            <ReviewLazy productId={product.id} product={product} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
