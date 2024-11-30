"use client";

import { User, ShoppingCartIcon } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchWithSuggestions } from "../searchBars/userSearch";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { countQuantity } from "@/api/cart/countItem";
import { changeQuantity } from "@/store/features/cartSlice";
import ShoppingCard from '../card/shoppingCard';

const UserHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    countQuantity().then((data) => {
      dispatch(changeQuantity(data.result.quantity));
    }).catch((err) => {
      dispatch(changeQuantity(0));
    });
  }, [dispatch])

  const quantity = useSelector((state) => state.cartReducer.count);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isHeaderVisible =
    !pathname.includes("/admin") &&
    !pathname.includes("/vendor") &&
    !pathname.includes("/user") &&
    !pathname.includes("/auth") &&
    !pathname.includes("/checkout") &&
    !pathname.includes("/cart");

  if (!isHeaderVisible) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 pt-2 transition-transform duration-300 ${isScrolled ? "-translate-y-2 bg-black-primary" : "translate-y-0"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="w-full bg-black-primary text-white rounded-lg">
          <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
            <Link
              href="/"
              className="text-sm font-bold text-white-primary hover:text-white-tertiary transition-colors"
            >
              HK-Uptech
            </Link>

            <div className="flex-1 flex justify-center px-4">
              <SearchWithSuggestions />
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white-primary"
                onClick={() => router.push("/user/")}
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
              <div
                className="relative"
                onMouseEnter={() => setIsCartVisible(true)}
                onMouseLeave={() => setIsCartVisible(false)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white-primary relative"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  <div className="sr-only">Cart</div>
                  {quantity > 0 && (
                    <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-red-primary text-[10px] font-bold flex items-center justify-center">
                      {quantity}
                    </div>
                  )}
                </Button>
                {isCartVisible && <ShoppingCard />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;

