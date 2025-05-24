"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { getTop5CartItems } from "@/api/cart/getTop5CartItem";
import ShopEmpty from "@/assets/images/storeEmpty.jpg";
import { useSelector } from "react-redux";
import Loading from "../loading";

export default function ShoppingCard({ t }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const count = useSelector((state) => state.cartReducer.count);

  useEffect(() => {
    const fetchCartData = async () => {
      setIsLoading(true);
      try {
        const data = await getTop5CartItems();
        setCartItems(data.result);
      } catch (error) {
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCartData();
  }, []);

  if (cartItems.length === 0) {
    if (isLoading) {
      return (
        <Card className="w-[360px] p-6 text-center">
          <Loading />
        </Card>
      );
    } else {
      return (
        <Card className="w-[360px] p-6 text-center">
          <Image
            src={ShopEmpty}
            alt="Empty Cart"
            width={180}
            height={180}
            className="mx-auto mb-4"
          />
        </Card>
      );
    }
  }

  return (
    <Card className="w-[360px] p-0 overflow-auto border-none">
      <div className="p-3 border-b bg-black-primary text-white-primary">
        <h3 className="text-[.9em] text-center">
          {t("text_new_products_added")}
        </h3>
      </div>
      <div className="max-h-[400px] overflow-y-auto flex no-scrollbar flex-col gap-1 p-2">
        {cartItems.map((item) => (
          <Link
            href={`/${item.slug}`}
            key={item.id}
            className="w-full flex flex-col items-center gap-2 p-1 shadow-md rounded-md"
          >
            <div className="w-full flex flex-row items-start justify-start gap-2">
              <Image
                src={item.image || ShopEmpty}
                alt={item.name}
                width={100}
                height={100}
                className="object-contain rounded-sm h-full aspect-square shadow-md"
              />
              <div className="w-full flex flex-col justify-start items-start flex-grow">
                <h4 className="text-[.9em] line-clamp-2">{item.name}</h4>
                <p className="text-[1.1em] text-red-primary">
                  ₫{item.salePrice.toLocaleString()}
                </p>
                <div className="w-full flex flex-row flex-wrap items-center justify-end gap-2">
                  {item.value &&
                    item.value.map((value) => (
                      <div
                        key={value}
                        className="bg-white-primary text-red-primary border rounded-sm truncate px-2 text-[.9em]"
                      >
                        {value}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="p-2 border-t">
        <div className="text-[.9em] pb-2 text-center">
          {t("text_count", { count })}
        </div>
        <Button className="w-full bg-red-primary text-white-primary" asChild>
          <Link href="/cart">{t("text_view_cart")}</Link>
        </Button>
      </div>
    </Card>
  );
}
