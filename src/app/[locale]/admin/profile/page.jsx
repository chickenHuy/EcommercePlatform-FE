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
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import avatar from "../../../../../public/images/iconNotFound.png";
import DatePicker from "./datePicker";
import RadioGroupGender from "./radioGroupGender";

export const description =
  "A settings page. The settings page has a sidebar navigation and a main content area. The main content area has a form to update the store name and a form to update the plugins directory. The sidebar navigation has links to general, security, integrations, support, organizations, and advanced settings.";

export default function ManageProfile() {
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
          <Link
            href="http://localhost:3000/en/admin/profile"
            className="font-semibold text-primary"
          >
            Hồ sơ
          </Link>
          <Link href="http://localhost:3000/en/admin/account">Tài khoản</Link>
          <Link href="http://localhost:3000/en/admin/change-password">
            Đổi mật khẩu
          </Link>
        </nav>
        <div className="grid gap-6">
          <Card x-chunk="dashboard-04-chunk-1" className="shadow-lg rounded-lg">
            <CardHeader className="text-center border-b py-6">
              <CardTitle className="text-2xl font-bold">
                Hồ sơ của bạn
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center gap-6">
              <Image
                src={avatar}
                width={200}
                height={200}
                alt="Avatar"
                className="rounded-full border-2 border-black-tertiary shadow-md"
              />
              <form className="w-full space-y-4">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium">
                    Họ và tên
                  </Label>
                  <Input
                    id="name"
                    placeholder="Họ và tên"
                    className="mt-1 w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <Label htmlFor="bio" className="block text-sm font-medium">
                    Tiểu sử
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tiểu sử"
                    className="mt-1 w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium"
                  >
                    Ngày sinh
                  </Label>
                  <DatePicker />
                </div>
                <div>
                  <Label htmlFor="gender" className="block text-sm font-medium">
                    Giới tính
                  </Label>
                  <RadioGroupGender />
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
