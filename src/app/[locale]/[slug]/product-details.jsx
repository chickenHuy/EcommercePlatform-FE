"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { changeQuantity } from "@/store/features/cartSlice";
import { setStore } from "@/store/features/userSearchSlice";
import { setWishList } from "@/store/features/wishListSlice";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";

import { useToast } from "@/hooks/use-toast";
import { StoreChat } from "@/components/chat/storeChat";
import ProductDetailSuggestions from "./product-detail-suggestions";
import { ProductMediaViewer } from "./product-media-viewer";
import { ProductSpecifications } from "./product-specifications";

import StoreEmpty from "@/assets/images/storeEmpty.jpg";

import { Star, ShoppingCart, Heart, Minus, Plus, Store } from "lucide-react";

import { addToCart } from "@/api/cart/addToCart";
import { get, post } from "@/lib/httpClient";
import Link from "next/link";
import Reviews from "./reviewPage";

export default function ProductDetail({ product, t }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [availableOptions, setAvailableOptions] = useState({});

  const { toast } = useToast();

  const router = useRouter();
  const currentPrice = selectedVariant?.salePrice || product.salePrice;
  const currentOriginalPrice =
    selectedVariant?.originalPrice || product.originalPrice;

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
        variant.values.some((v) => v.attribute === attr && v.value === val),
      ),
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
              .map((val) => val.value),
          ),
        );
      } else {
        newAvailableOptions[attr.name] = new Set(
          attr.values.map((v) => v.value),
        );
      }
    });
    setAvailableOptions(newAvailableOptions);

    if (
      Object.keys(newSelectedAttributes).length === product.attributes.length
    ) {
      const exactMatch = validVariants.find((v) =>
        v.values.every(
          (val) => newSelectedAttributes[val.attribute] === val.value,
        ),
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

    try {
      await addToCart(request);
      const qty = oldQuantity + quantity;
      dispatch(changeQuantity(qty));
      toast({
        title: t("toast_title_product_to_cart"),
        description: t("toast_description_product_to_cart"),
      });
    } catch (error) {
      toast({
        title: t("toast_title_error_product"),
        description: error.message,
        variant: "destructive",
      });
      if(error.message === "Uncategorized Error") {
        router.push("/auth");
      }
    }
  };

  const handleLoveProduct = async () => {
    try {
      await post(`/api/v1/users/follow/${product.id}`);
      toast({
        title: t("toast_title_product_to_wishlist"),
        description: t("toast_description_product_to_wishlist"),
      });

      get(`/api/v1/users/listFollowedProduct`)
        .then((res) => {
          dispatch(setWishList(res.result));
        })
        .catch(() => {
          dispatch(setWishList([]));
        });
    } catch (error) {
      toast({
        title: t("toast_title_error_product_wishlist"),
        description: error.message,
        variant: "destructive",
      });
      if(error.message === "Uncategorized Error") {
        router.push("/auth");
      }
    }
  };

  const handleOnClickViewShop = (storeId) => {
    dispatch(setStore(storeId));
    router.push("/search");
  };

  // useEffect(() => {
  //   const productId = product.id;
  //   const changeCount = async (productId) => {
  //     try {
  //       await put(`/api/v1/view_product/change_count/${productId}`);
  //     } catch (error) {
  //       toast({
  //         title: t("toast_title_error_product_wishlist"),
  //         description: error.message,
  //         variant: "destructive",
  //       });
  //     }
  //   };
  //   changeCount(productId);
  // }, [product.id]);

  return (
    <div className="w-full h-fit xl:px-28 lg:px-20 sm:px-6 px-4 py-20 flex flex-col gap-7">
      <Toaster />
      <div className="w-full h-fit shadow-md rounded-md p-3">
        <div className="grid gap-7 md:grid-cols-2">
          <div className="w-full h-fit relative">
            {product.quantity === 0 && (
              <div className={`w-full h-full absolute top-0 left-0 z-20`}>
                <div className="bg-black-primary text-white-primary h-24 absolute w-24 top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center">
                  {t("text_sold_out")}
                </div>
              </div>
            )}
            <ProductMediaViewer product={product} />
          </div>
          <div
            className={`w-full h-fit flex flex-col gap-3 animate-fade-in ${product.quantity === 0 ? "opacity-50 pointer-events-none" : ""
              }`}
          >
            <div>
              <h1 className="text-[1.1em] sm:text-[1.3em] lg:text-[1.6em] line-clamp-2">
                {product.name}
              </h1>

              <div className="flex items-center">
                <span className="text-[1em] pr-1 translate-y-[2px]">
                  {product.rating?.toFixed(1) || 0}
                </span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= (product.rating || 0)
                        ? "text-yellow-primary fill-yellow-primary"
                        : "text-gray-secondary"
                      }`}
                  />
                ))}
                <span className="text-[1em] pl-3 translate-y-[2px]">
                  {product.reviewCount
                    ? `(${product.reviewCount} ${t("text_review")})`
                    : `0 ${t("text_review")}`}
                </span>
              </div>
            </div>

            <div className="flex flex-row flex-wrap items-center gap-3 rounded-sm p-5 my-3 bg-white-secondary/30">
              {currentOriginalPrice > currentPrice && (
                <span className="text-[1em] text-black-tertiary line-through">
                  {currentOriginalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              )}
              <span className="text-[2em] text-red-primary">
                {currentPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>

            {product.attributes.map((attribute) => (
              <div key={attribute.id}>
                <h3 className="text[1em]">{attribute.name}</h3>
                <div className="mt-1 flex flex-wrap gap-3">
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
                        value.value,
                      )}
                    >
                      {value.value}
                    </Button>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <h3 className="text-[1em]">{t("text_quantity")}</h3>
              <div className="mt-1 flex items-center space-x-1">
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
                <span className="text-[.9em] px-2">
                  {selectedVariant
                    ? selectedVariant.quantity
                    : product.quantity}{" "}
                  {t("text_product_available")}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-5">
              <Button
                className="flex-grow bg-red-primary text-[1em]"
                size="lg"
                disabled={!selectedVariant && product.variants.length > 0}
                onClick={() => addProductToCart()}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {t("text_add_to_cart")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="sm:w-fit w-full"
                onClick={() => handleLoveProduct()}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-fit p-5 bg-blue-tertiary rounded-md shadow-md animate-fade-in">
        <div className="w-full h-fit flex flex-col gap-5 justify-center items-center">
          <h2 className="text-[1.5em]">{t("text_shop_info")}</h2>
          <div className="flex flex-col items-center justify-center gap-3">
            <Image
              src={product.store.imageUrl ? product.store.imageUrl : StoreEmpty}
              alt={product.store.name}
              width={100}
              height={100}
              className="object-cover shadow-md rounded-full aspect-square"
            />
            <div>
              <h3 className="text-[1.3em]">{product.store.name}</h3>
              {product.store.rating ? (
                <p className="text-[1em] text-center">
                  {t("text_review_upcase")}
                  {product.store.rating?.toFixed(1)}/5.0
                </p>
              ) : (
                <p className="text-[1em] text-center">{t("text_not_review")}</p>
              )}
            </div>
          </div>
          <div className="w-fit h-fit flex flex-row gap-3">
            <Link href={`/search?storeId=${product.store.id}`}>
              <Button
                variant="outline"
                onClick={() => handleOnClickViewShop(product.store.id)}
              >
                <Store className="mr-1 p-1"></Store>
                {t("text_view_shop")}
              </Button>
            </Link>
            <StoreChat
              storeId={product.store.id}
              productId={product.id}
              websocketUrl={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ws`}
              isStore={false}
              t={t}
            />
          </div>
        </div>
      </div>
      <div className="w-full h-fit py-14 lg:px-14 sm:px-7 px-3 shadow-md rounded-md">
        <div className="flex flex-col gap-7">
          <div>
            <h2 className="text-[1.5em] text-center">
              {t("text_product_description")}
            </h2>
            <div
              className="text-[1em]"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          <div>
            <h2 className="text-[1.5em] text-center">
              {t("text_product_detail")}
            </h2>
            <div
              className="text-[1em]"
              dangerouslySetInnerHTML={{ __html: product.details }}
            />
          </div>
          <ProductSpecifications components={product.components || []} t={t} />
        </div>

        <Separator className="my-7" />
        <Reviews productId={product.id} t={t} />

        <Separator className="my-7" />
        <ProductDetailSuggestions productId={product.id} />

      </div>
    </div>
  );
}
