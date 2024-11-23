"use client";
import { useState } from "react";
import { ThemeProvider } from "@/components/themes/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import CommonHeader from "@/components/headers/commonHeader";

export default function UserLayout({ children }) {
  const [activeLink, setActiveLink] = useState("/user");

  const handleLinkClick = (href) => {
    setActiveLink(href);
  };

  return (
    <body>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <CommonHeader />
        <div className="flex min-h-screen w-full flex-col">
          <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col bg-muted/40 p-4 md:p-10 ">
            <Toaster />
            <div className="mx-auto w-full">
              <h1 className="text-3xl font-semibold mb-6">Cài đặt chung</h1>
            </div>
            <div className="mx-auto grid w-full gap-6 md:grid-cols-[250px_1fr]">
              <nav
                className="flex flex-col gap-4 text-sm text-muted-foreground"
                x-chunk="dashboard-04-chunk-0"
              >
                <Link
                  href="/user"
                  onClick={() => handleLinkClick("/user")}
                  className={`${
                    activeLink === "/user" ? "text-primary font-semibold" : ""
                  } hover:text-primary transition-colors`}
                >
                  Hồ sơ
                </Link>
                <Link
                  href="/user/account"
                  onClick={() => handleLinkClick("/user/account")}
                  className={`${
                    activeLink === "/user/account"
                      ? "text-primary font-semibold"
                      : ""
                  } hover:text-primary transition-colors`}
                >
                  Tài khoản
                </Link>
                <Link
                  href="/user/address"
                  onClick={() => handleLinkClick("/user/address")}
                  className={`${
                    activeLink === "/user/address"
                      ? "text-primary font-semibold"
                      : ""
                  } hover:text-primary transition-colors`}
                >
                  Địa chỉ
                </Link>
                <Link
                  href="/user/change-password"
                  onClick={() => handleLinkClick("/user/change-password")}
                  className={`${
                    activeLink === "/user/change-password"
                      ? "text-primary font-semibold"
                      : ""
                  } hover:text-primary transition-colors`}
                >
                  Đổi mật khẩu
                </Link>
              </nav>
              <div className="grid gap-6">{children}</div>
            </div>
          </main>
        </div>
      </ThemeProvider>
    </body>
  );
}
