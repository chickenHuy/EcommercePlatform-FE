"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const description =
  "A settings page. The settings page has a sidebar navigation and a main content area. The main content area has a form to update the store name and a form to update the plugins directory. The sidebar navigation has links to general, security, integrations, support, organizations, and advanced settings.";

export default function ManageAccount() {
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);

  const handleEmailConfirmation = () => {
    setIsEmailConfirmed(true);
  };

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Cài đặt chung</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <Link href="http://localhost:3000/en/admin/profile">Hồ sơ</Link>
          <Link href="http://localhost:3000/en/admin/account">Tài khoản</Link>
          <Link
            href="http://localhost:3000/en/admin/change-password"
            className="font-semibold text-primary"
          >
            Đổi mật khẩu
          </Link>
        </nav>
        <div className="grid gap-6">
          <Card x-chunk="dashboard-04-chunk-1" className="shadow-lg rounded-lg">
            <CardHeader className="text-center border-b py-6">
              <CardTitle className="text-2xl font-bold">Đổi mật khẩu</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center gap-6">
              <form className="w-full space-y-4">
                <div>
                  <Label
                    htmlFor="oldPassword"
                    className="block text-sm font-medium"
                  >
                    Mật khẩu
                  </Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    placeholder="Mật khẩu cũ"
                    className="mt-1 w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="newPassword"
                    className="block text-sm font-medium"
                  >
                    Mật khẩu mới
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Mật khẩu mới"
                    className="mt-1 w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="confirmNewPassword"
                    className="block text-sm font-medium"
                  >
                    Xác nhận mật khẩu mới
                  </Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    placeholder="Xác nhận mật khẩu mới"
                    className="mt-1 w-full border rounded-lg p-2"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-center">
              <Button className="text-xl font-bold">Lưu</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
