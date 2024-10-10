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
import { CircleCheck } from "lucide-react";

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
          <Link
            href="http://localhost:3000/en/admin/account"
            className="font-semibold text-primary"
          >
            Tài khoản
          </Link>
          <Link href="http://localhost:3000/en/admin/change-password">
            Đổi mật khẩu
          </Link>
        </nav>
        <div className="grid gap-6">
          <Card x-chunk="dashboard-04-chunk-1" className="shadow-lg rounded-lg">
            <CardHeader className="text-center border-b py-6">
              <CardTitle className="text-2xl font-bold">
                Tài khoản của tôi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center gap-6">
              <form className="w-full space-y-4">
                <div>
                  <Label
                    htmlFor="username"
                    className="block text-sm font-medium"
                  >
                    Tên đăng nhập
                  </Label>
                  <Input
                    id="username"
                    defaultValue="ADMIN"
                    className="mt-1 w-full border rounded-lg p-2"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-grow">
                    <Label
                      htmlFor="email"
                      className="block text-sm font-medium"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      defaultValue="nguyenminhkhanhla62@gmail.com"
                      className="mt-1 w-full border rounded-lg p-2"
                    />
                  </div>
                  {isEmailConfirmed && <CircleCheck className="mt-6 w-5 h-5" />}
                  <Button className="mt-6 text-sm">Thay đổi</Button>
                </div>
                <div className="mt-2">
                  {!isEmailConfirmed ? (
                    <Button
                      className="mt-1 text-sm"
                      onClick={handleEmailConfirmation}
                    >
                      Xác nhận email
                    </Button>
                  ) : (
                    <span className="text-sm">Email đã xác nhận</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-grow">
                    <Label
                      htmlFor="phone"
                      className="block text-sm font-medium"
                    >
                      Số điện thoại
                    </Label>
                    <Input
                      id="phone"
                      defaultValue="0942802649"
                      className="mt-1 w-full border rounded-lg p-2"
                    />
                  </div>
                  <Button className="mt-6 text-sm">Thay đổi</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
