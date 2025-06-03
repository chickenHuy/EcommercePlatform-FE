"use client";

import {
  User,
  ShoppingCartIcon,
  Menu,
  X,
  SquareChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchWithSuggestions } from "../searchBars/userSearch";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { countQuantity } from "@/api/cart/countItem";
import { changeQuantity } from "@/store/features/cartSlice";
import ShoppingCard from "../card/shoppingCard";
import { get } from "@/lib/httpClient";
import WishlistPopup from "../popUp/wishListPopUp";
import { StoreChat } from "../chat/storeChat";
import { useTranslations } from "next-intl";
import { Logo, LogoText } from "../logo";
import UserMenuComponent from "../user-menu";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

const MainHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const dispatch = useDispatch();
  const quantity = useSelector((state) => state.cartReducer.count);
  const t = useTranslations("MainHeader");

  const hiddenPaths = [
    "/admin",
    "/vendor",
    "/user",
    "/auth",
  ];

  const isHeaderVisible = !hiddenPaths.some((path) => pathname.includes(path));

  const fetchUserAndCart = async () => {
    try {
      setIsLoading(true);
      const [userRes, cartRes] = await Promise.all([
        get("/api/v1/users/info"),
        countQuantity(),
      ]);
      setUser(userRes.result);
      dispatch(changeQuantity(cartRes.result.quantity));
    } catch {
      setUser(null);
      dispatch(changeQuantity(0));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUserAndCart();
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (!isHeaderVisible) return null;

  const roleLink =
    user?.lastRole === "USER"
      ? "/register-store"
      : user?.lastRole === "SELLER"
        ? "/vendor/"
        : user?.lastRole === "ADMIN"
          ? "/admin"
          : "/";

  const roleText =
    user?.lastRole === "USER"
      ? t("text_become_seller")
      : user?.lastRole === "SELLER"
        ? t("text_go_to_seller_page")
        : user?.lastRole === "ADMIN"
          ? t("text_go_to_admin_page")
          : "";

  return (
    <header
      className={`w-full h-fit fixed top-0 left-0 right-0 z-50 pt-2 transition-transform duration-500 ${
        isScrolled ? "-translate-y-2 bg-black-primary" : "translate-y-0"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-20 xl:px-28">
        <div className="w-full bg-black-primary text-white rounded-lg">
          <div className="flex items-center justify-between h-14 sm:h-16 px-2 sm:px-4 lg:px-6">
            {/* Logo and Brand */}
            <div className="w-fit h-fit flex flex-row justify-center items-center gap-1 sm:gap-3">
              <Link href="/" className="flex items-center">
                <Logo width={40} color="#f1f1f1" />
                <div className="hidden sm:block">
                  <LogoText height={20} color="#f1f1f1" />
                </div>
              </Link>
              <Link
                href={roleLink}
                className="text-[.9em] text-white-tertiary hover:text-white-primary hidden lg:block"
              >
                {roleText}
              </Link>
            </div>

            {/* Search Bar - Hidden on Mobile & Tablet */}
            <div className="hidden lg:flex flex-1 justify-center px-4">
              <SearchWithSuggestions t={t} />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <WishlistPopup t={t} />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white-primary relative"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    {quantity > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-primary text-white-primary text-[.8em] rounded-full w-[18px] h-[18px] flex items-center justify-center">
                        {quantity}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="my-3 shadow-none border-none w-[360px] bg-transparent-primary p-0"
                >
                  <ShoppingCard t={t} />
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="relative mx-2">
                <StoreChat
                  websocketUrl={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ws`}
                  isStore={false}
                  productId=""
                  orderId=""
                />
              </div>

              {isLoading ? (
                <div className="w-[150px] h-11 rounded-md shadow-sm shadow-white-tertiary relative">
                  <div className="global_loading_icon white"></div>
                </div>
              ) : user ? (
                <UserMenuComponent user={user} />
              ) : (
                <Link
                  href="/auth"
                  className="w-[150px] h-11 rounded-md shadow-sm shadow-white-tertiary text-white-secondary flex justify-center items-center gap-3"
                >
                  <User className="h-5 w-5 -translate-y-[2px]" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile & Tablet Search - Full Width */}
            <div className="lg:hidden flex-1 mx-2">
              <SearchWithSuggestions t={t} />
            </div>

            <div className="lg:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="text-white-primary relative"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
                {quantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-primary text-white-primary text-[.8em] rounded-full w-[18px] h-[18px] flex items-center justify-center">
                    {quantity}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="flex flex-col gap-2 lg:hidden bg-black-primary border-t border-black-tertiary px-3 pt-3 rounded-b-lg">
              {roleText && (
                <Link
                  href={roleLink}
                  className="text-white-primary w-full h-fit p-3 flex flex-row items-center justify-start gap-3 rounded-md shadow-sm shadow-white-tertiary"
                >
                  <SquareChevronRight />
                  <span>{roleText}</span>
                </Link>
              )}

              <div className="relative">
                <Link
                  href="/cart"
                  className="text-white-primary w-full h-fit p-3 flex flex-row items-center justify-start gap-3 rounded-md shadow-sm shadow-white-tertiary"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  <span>Cart</span>
                </Link>
                {quantity > 0 && (
                  <span className="absolute top-1/2 -translate-y-1/2 right-3 bg-red-primary text-white-primary text-[.8em] rounded-full w-[18px] h-[18px] flex items-center justify-center">
                    {quantity}
                  </span>
                )}
              </div>

              <WishlistPopup t={t} isPhone={true} />

              <div className="flex flex-row justify-between items-center pt-1 border-t border-black-tertiary -translate-y-3">
                <StoreChat
                  websocketUrl={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ws`}
                  isStore={false}
                  productId=""
                  orderId=""
                />

                <div className="pt-2 pb-3">
                  {isLoading ? (
                    <div className="h-11 rounded-md shadow-md shadow-white-tertiary relative">
                      <div className="global_loading_icon white"></div>
                    </div>
                  ) : user ? (
                    <UserMenuComponent user={user} />
                  ) : (
                    <Link
                      href="/auth"
                      className="h-11 rounded-md shadow-md shadow-white-tertiary text-white-secondary flex items-center gap-3 px-4"
                    >
                      <User className="h-5 w-5" />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
