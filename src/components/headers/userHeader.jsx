"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { useTranslations } from "next-intl";
import { getProfile } from "@/api/user/profileRequest";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserMenuComponent from "../user-menu";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";
function UserHeader({ title = '', link = '' }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const t = useTranslations("VendorHeader");
  const { toast } = useToast();

  useEffect(() => {
    getProfile()
      .then((response) => {
        setUser(response.result);
      })
      .catch((error) => {
        toast({
          title: t('notify'),
          message: error.message,
          variant: 'destructive'
        })
        router.push("/auth");
      });
  }, []);

  return (
    <header className="fixed top-0 z-20 flex w-full h-16 items-center justify-between bg-black-primary px-3">
      <Link href={link} className="flex flex-row justify-center items-center cursor-pointer gap-2">
        <Logo width={50} height={50} color="#ffffff" />
        <span className="text-white-secondary text-[19px]">
          {title}
        </span>
      </Link>
      <Toaster />
      {user ? (
        <UserMenuComponent user={user} />
      ) : (
        <div className="w-[150px] h-11 rounded-md shadow-sm shadow-white-tertiary relative">
          <div className="global_loading_icon white"></div>
        </div>
      )}
    </header>
  );
}

export default UserHeader;
