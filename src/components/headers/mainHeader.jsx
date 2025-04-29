"use client";
import Cookies from "js-cookie";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { get, post } from '@/lib/httpClient';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import WishlistPopup from "../popUp/wishListPopUp";
import { StoreChat } from "../chat/storeChat";
import { useTranslations } from "next-intl";
import { Logo } from "../logo";
import HKKUptechLogo from "../logo/logo";

const UserHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const t = useTranslations("MainHeader");

  const getMe = async () => {
    await get("/api/v1/users/info").then((res) => {
      setUser(res.result);
    }).catch((err) => {
      setUser(null);
    })
  }

  useEffect(() => {
    countQuantity().then((data) => {
      dispatch(changeQuantity(data.result.quantity));
    }).catch((err) => {
      dispatch(changeQuantity(0));
    });

    getMe();


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
    !pathname.includes("/cart") &&
    !pathname.includes("/status");

  if (!isHeaderVisible) return null;


  const handleMyAccount = () => {
    router.push("/user");
  }

  const handleLogout = async () => {
    const token = Cookies.get(process.env.NEXT_PUBLIC_JWT_NAME);
    await post("/api/v1/auths/log-out", { token: token }).then(() => {
      Cookies.remove(process.env.NEXT_PUBLIC_JWT_NAME);
    }).catch((err) => {
      console.log(err);
    })
    router.push("/auth");
  }

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
              <HKKUptechLogo />
            </Link>
            <Link
              href={user?.lastRole === "USER" ? "/register-store" : user?.lastRole === "SELLER" ? "/vendor/" : user?.lastRole === "ADMIN" ? "/admin" : "/"}
              className="text-s font-normal ml-2 text-white-primary/40 hover:text-white-tertiary transition-colors"
            >
              {user?.lastRole === "USER" ? t("text_become_seller") : ""}
              {user?.lastRole === "SELLER" ? t("text_go_to_seller_page") : ""}
              {user?.lastRole === "ADMIN" ? t("text_go_to_admin_page") : ""}
            </Link>

            <div className="flex-1 flex justify-center px-4">
              <SearchWithSuggestions t={t} />
            </div>

            <div className="flex items-center space-x-4">
              <WishlistPopup t={t} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {user ? (<Button size="icon" variant="ghost">
                    <Avatar className="h-6 w-6">
                      <AvatarImage className="h-6 w-6" src={user.imageUrl} >

                      </AvatarImage>
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>) : (<Button
                    variant="ghost"
                    size="icon"
                    className="text-white-primary"
                  >
                    <User className="h-5 w-5" />
                  </Button>)}
                </DropdownMenuTrigger>
                {user ? (<DropdownMenuContent className="w-56">
                  <DropdownMenuLabel className="truncate">{user ? user.name : "My Account"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleMyAccount()}>
                    {t('text_account')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLogout()}>
                    {t("text_log_out")}
                  </DropdownMenuItem>
                </DropdownMenuContent>) : (
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem>
                      <Link href="/auth">
                        {t("text_auth")}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>)}
              </DropdownMenu>
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
                  {quantity > 0 && (
                    <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-red-primary text-[10px] font-bold flex items-center justify-center">
                      {quantity}
                    </div>
                  )}
                </Button>
                {isCartVisible && <ShoppingCard t={t} />}
              </div>
              <div
                className="relative"
              >
                <StoreChat websocketUrl={"http://localhost:8080/api/v1/ws"} isStore={false} productId={""} orderId={""} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;

