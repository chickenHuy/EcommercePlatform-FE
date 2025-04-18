"use client";

import { ThemeProvider } from "@/components/themes/theme-provider";
import Link from "next/link";
import UserHeader from "@/components/headers/userHeader";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from 'lucide-react';

export default function UserLayout({ children }) {
  const t = useTranslations("Header");
  const tUser = useTranslations("User.layout");
  const pathName = usePathname();
  const active = pathName.split("/")[pathName.split("/").length - 1];
  const [isShowUserMenu, setIsShowUserMenu] = useState(false);

  const title = {
    "user": tUser('profile'),
    "orders": tUser('orders'),
    "account": tUser('account'),
    "address": tUser('address'),
    "change-password": tUser('change_password'),
  }

  console.log(pathName);

  useEffect(() => {
    setIsShowUserMenu(false);
    document.title = t('userTitle') + " | " + (title[active] || tUser('orders'));
  }, [pathName]);

  return (
    <div>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <UserHeader title={t('userTitle')} link="/user" />

        <div className="p-1 z-50 fixed lg:hidden top-[70px] left-2 shadow-md shadow-white-secondary rounded-sm cursor-pointer hover:bg-white-secondary" onClick={() => setIsShowUserMenu(true)}>
          {!isShowUserMenu && <Menu className="w-8 h-8" />}
        </div>

        <div className="h-fit min-h-screen w-full flex flex-row pt-[64px]">
          <div className={`lg:w-[300px] w-[250px] h-fit min-h-screen bg-[#f9f9f9] py-5 px-3 border-r border-white-secondary flex flex-col justify-start items-start gap-4 lg:fixed absolute scale-0 lg:scale-100 z-50 ${isShowUserMenu ? "scale-100" : "scale-0"}`}>
            <X className={`absolute p-1 scale-125 top-2 right-2 hover:bg-white-secondary cursor-pointer ${!isShowUserMenu && "hidden"}`} onClick={() => setIsShowUserMenu(false)} />
            <h1 className="text-[1.5em]">{tUser('setting')}</h1>
            <div className="h-fit w-full flex flex-col gap-2">
              <Link className={`py-2 px-4 rounded-md shadow-md shadow-white-secondary ${active === 'user' ? 'bg-black-primary text-white-secondary ' : 'border-white-secondary border'}`} href="/user">
                {tUser('profile')}
              </Link>
              <Link className={`py-2 px-4 rounded-md shadow-md shadow-white-secondary ${active === 'orders' ? 'bg-black-primary text-white-secondary ' : 'border-white-secondary border'}`} href="/user/orders">
                {tUser('orders')}
              </Link>
              <Link className={`py-2 px-4 rounded-md shadow-md shadow-white-secondary ${active === 'account' ? 'bg-black-primary text-white-secondary ' : 'border-white-secondary border'}`} href="/user/account">
                {tUser('account')}
              </Link>
              <Link className={`py-2 px-4 rounded-md shadow-md shadow-white-secondary ${active === 'address' ? 'bg-black-primary text-white-secondary ' : 'border-white-secondary border'}`} href="/user/address">
                {tUser('address')}
              </Link>
              <Link className={`py-2 px-4 rounded-md shadow-md shadow-white-secondary ${active === 'change-password' ? 'bg-black-primary text-white-secondary ' : 'border-white-secondary border'}`} href="/user/change-password">
                {tUser('change_password')}
              </Link>
            </div>
          </div>
          <div className="w-full h-fit py-5">
            {children}
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
