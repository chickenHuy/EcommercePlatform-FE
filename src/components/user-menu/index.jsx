import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CircleUserRound, LogOut, ShoppingBag } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { Store } from "lucide-react";
import { UserRoundPen } from "lucide-react";
import { Languages } from "lucide-react";
import { useState } from "react";
import { localeDetector } from "@/utils";
import Image from "next/image";
import Cookies from "js-cookie";
import { post } from "@/lib/httpClient";
import Link from "next/link";

const UserMenuComponent = (props) => {
  const { user } = props;
  const [isShowUserMenu, setIsShowUserMenu] = useState(false);
  const router = useRouter();
  const locale = localeDetector() ? "en" : "vi";
  const t = useTranslations("VendorHeader");
  const pathName = usePathname();

  const handleLogout = async () => {
    const token = Cookies.get(process.env.NEXT_PUBLIC_JWT_NAME);
    await post("/api/v1/auths/log-out", { token: token })
      .then(() => {
        Cookies.remove(process.env.NEXT_PUBLIC_JWT_NAME);
      })
      .catch((err) => {
        console.log(err);
      });
    router.push("/auth");
  };

  const handleChangeLanguage = (newValue) => {
    const segments = pathName.split("/");

    if (segments[1] === "vi" || segments[1] === "en") {
      segments[1] = newValue;
    } else {
      segments.splice(1, 0, newValue);
    }

    const currentQuery = new URLSearchParams(location.search);
    const queryString = currentQuery.toString();
    const newPath = segments.join("/") + (queryString ? `?${queryString}` : "");

    router.push(newPath);
  };

  return (
    <DropdownMenu open={isShowUserMenu} onOpenChange={setIsShowUserMenu}>
      <DropdownMenuTrigger className="outline-none px-3 py-2 max-w-[200px]">
        <div className="flex flex-row justify-center items-center gap-2 cursor-pointer">
          {user?.imageUrl ? (
            <Image
              src={user?.imageUrl}
              alt="Ảnh đại diện"
              width={30}
              height={30}
              className="w-[30px] h-[30px] rounded-full object-cover"
            />
          ) : (
            <div>
              <CircleUserRound
                width={30}
                height={30}
                className="text-white-secondary"
              />
            </div>
          )}
          <span className="max-w-[100px] text-white-secondary text[0.9em] truncate">
            {user?.name}
          </span>
          {!isShowUserMenu ? (
            <ChevronDown className="scale-75 text-white-secondary" />
          ) : (
            <ChevronUp className="scale-75 text-white-secondary" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] mt-3 mr-3">
        <DropdownMenuLabel className="text-center text-[1em]">
          {t("userOptionsMenu.account-information")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="w-full h-fit flex flex-col justify-center items-center gap-1 py-3">
          {user?.imageUrl ? (
            <Image
              src={user?.imageUrl}
              alt="Ảnh đại diện"
              width={70}
              height={70}
              className="w-[70px] h-[70px] rounded-full object-cover"
            />
          ) : (
            <div>
              <CircleUserRound
                width={70}
                height={70}
                className="text-black-secondary"
              />
            </div>
          )}
          <span className="text-black-secondary text[0.9em] truncate">
            {user?.name}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            className="flex flex-row justify-start items-center gap-3 px-3"
            href="/"
          >
            <ShoppingBag />
            {t("userOptionsMenu.home_page")}
          </Link>
        </DropdownMenuItem>

        {user.roles.some((role) => role.name === "SELLER") && (
          <DropdownMenuItem>
            <Link
              className="flex flex-row justify-start items-center gap-3 px-3"
              href="/vendor/store"
            >
              <Store />
              {t("userOptionsMenu.shop-information")}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Link
            className="flex flex-row justify-start items-center gap-3 px-3"
            href="/user"
          >
            <UserRoundPen />
            {t("userOptionsMenu.account-information")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex flex-row justify-start items-center gap-3 px-5 cursor-pointer">
          <Languages />
          <span className="flex-grow">{t("userOptionsMenu.language")}</span>
          <Select
            defaultValue={locale}
            onValueChange={(newValue) => {
              handleChangeLanguage(newValue);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vi">Tiếng Việt</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex flex-row justify-start items-center gap-3 px-5 cursor-pointer"
          onClick={() => handleLogout()}
        >
          <LogOut />
          {t("userOptionsMenu.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenuComponent;
