"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import iconNotFound from "../../../../../../public/images/iconNotFound.png";
import DatePicker from "./datePicker";
import RadioGroupGender from "./radioGroupGender";
import { getProfile, updateProfile } from "@/api/admin/profileRequest";
import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const profileSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Họ và tên không được để trống",
  }),
  bio: z.string().trim(),
  dateOfBirth: z.preprocess(
    (arg) => {
      if (typeof arg === "string" || arg instanceof Date) {
        return new Date(arg);
      }
      return arg;
    },
    z
      .date()
      .nullable()
      .refine((date) => date !== null, {
        message: "Vui lòng chọn ngày sinh",
      })
  ),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
});

export default function ManageProfile() {
  const [profile, setProfile] = useState([]);
  const { toast } = useToast();

  const formData = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name || "",
      bio: profile.bio || "",
      dateOfBirth: profile.dateOfBirth || null,
      gender: profile.gender || "MALE",
    },
  });

  const fetchFrofile = useCallback(async () => {
    try {
      const response = await getProfile();
      setProfile(response.result);
      console.log(response.result);
      formData.reset(response.result);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [toast, formData]);

  useEffect(() => {
    fetchFrofile();
  }, [fetchFrofile]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      bio: data.bio.trim() === "" ? null : data.bio.trim(),
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth).toLocaleDateString("sv-SE")
        : null,
    };
    console.log("Dữ liệu form:", payload);
    try {
      const updated = await updateProfile(profile.id, payload);
      toast({
        title: "Thành công",
        description: "Thông tin hồ sơ đã được cập nhật.",
      });
      setProfile(updated.result);
      fetchFrofile();
    } catch (error) {
      console.log("Error updating profile:", error);
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <Toaster />
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Cài đặt chung</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <Link
            href="http://localhost:3000/en/admin/setting/profile"
            className="font-semibold text-primary"
          >
            Hồ sơ
          </Link>
          <Link href="http://localhost:3000/en/admin/setting/account">
            Tài khoản
          </Link>
          <Link href="http://localhost:3000/en/admin/setting/change-password">
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
                alt="Ảnh thương hiệu"
                className="rounded-full border-2 border-black-tertiary shadow-md"
                src={profile.imageUrl ? profile.imageUrl : iconNotFound}
                width="200"
                height="200"
                unoptimized
                priority
              />
              <form
                onSubmit={formData.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium">
                    Họ và tên
                  </Label>
                  <div className="w-full space-y-2">
                    <Input
                      {...formData.register("name")}
                      placeholder="họ và tên"
                      className="mt-1 w-full border rounded-lg p-2"
                    />
                    {formData.formState.errors.name && (
                      <p className="text-sm text-error col-start-2 col-span-3">
                        {formData.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio" className="block text-sm font-medium">
                    Tiểu sử
                  </Label>
                  <Textarea
                    {...formData.register("bio")}
                    placeholder="tiểu sử"
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
                  <div className="w-full space-y-2">
                    <Controller
                      name="dateOfBirth"
                      control={formData.control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                        />
                      )}
                    />
                    {formData.formState.errors.dateOfBirth && (
                      <p className="text-sm text-error col-start-2 col-span-3">
                        {formData.formState.errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="gender" className="block text-sm font-medium">
                    Giới tính
                  </Label>
                  <Controller
                    name="gender"
                    control={formData.control}
                    render={({ field }) => (
                      <RadioGroupGender
                        selectedValue={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                </div>
                <div className="border-t px-6 py-4 flex justify-center">
                  <Button type="submit" className="text-xl font-bold">
                    Lưu
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
