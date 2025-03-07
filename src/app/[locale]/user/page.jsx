"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "./datePicker";
import RadioGroupGender from "./radioGroupGender";
import {
  getProfile,
  updateProfile,
  uploadUserImage,
} from "@/api/user/profileRequest";
import { useState, useEffect, useCallback, useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import BrandEmpty from "@/assets/images/brandEmpty.jpg";
import Image from "next/image";

const validImageTypes = ["image/jpg", "image/jpeg", "image/png"];

const profileSchema = z.object({
  imageUrl: z
    .any()
    .refine(
      (file) => {
        if (!file) return false;
        if (typeof file === "string") return true;
        return validImageTypes.includes(file.type);
      },
      {
        message: "Hình ảnh phải có dạng jpg, jpeg hoặc png",
      }
    )
    .optional(),
  name: z
    .string()
    .trim()
    .min(2, {
      message: "Họ và tên phải từ 2 đến 50 ký tự",
    })
    .max(50, {
      message: "Họ và tên phải từ 2 đến 50 ký tự",
    }),
  bio: z
    .string()
    .trim()
    .max(255, {
      message: "Bio không được vượt quá 255 ký tự",
    })
    .nullable(),
  dateOfBirth: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
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
  const [userId, setUserId] = useState("");
  const [fileImageUrl, setFileImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [loadPage, setLoadPage] = useState(true);
  const { toast } = useToast();

  const formData = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      imageUrl: BrandEmpty,
      name: "",
      bio: "",
      dateOfBirth: new Date(),
      gender: "MALE",
    },
  });

  const fetchProfile = useCallback(async () => {
    try {
      const response = await getProfile();
      setUserId(response.result.id);
      formData.reset(response.result);
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadPage(false);
    }
  }, [toast, formData]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onSubmit = async (profileData) => {
    const editedData = {
      ...profileData,
      dateOfBirth: profileData.dateOfBirth
        ? new Date(profileData.dateOfBirth).toLocaleDateString("sv-SE")
        : new Date().toLocaleDateString("sv-SE"),
    };

    try {
      await updateProfile(userId, editedData);
      if (fileImageUrl) {
        await uploadUserImage(fileImageUrl);
      }
      toast({
        description: "Cập nhật thông tin hồ sơ thành công",
      });
      fetchProfile();
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (event) => {
    const tempFile = event.target.files[0];
    if (tempFile) {
      setFileImageUrl(tempFile);
      formData.setValue("imageUrl", tempFile);
      formData.trigger("imageUrl");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      {loadPage && (
        <div className="fixed inset-0 flex flex-col justify-center items-center z-[500] space-y-4 bg-black-primary">
          <Label className="text-2xl text-white-primary">
            Đang tải dữ liệu...
          </Label>
        </div>
      )}

      {!loadPage && (
        <div className="flex justify-center items-center">
          <Card className="w-full min-w-[600px] max-w-[1200px] shadow-xl rounded-xl">
            <CardHeader className="text-center border-b">
              <CardTitle className="text-2xl font-bold">
                Hồ sơ của tôi
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center py-8">
              <div className="cursor-pointer" onClick={handleFileInputClick}>
                <Image
                  alt="ảnh đại diện"
                  className="aspect-square rounded-full object-cover"
                  src={
                    fileImageUrl
                      ? URL.createObjectURL(fileImageUrl)
                      : formData.watch("imageUrl")
                  }
                  width={200}
                  height={200}
                  unoptimized
                  priority
                />
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e)}
                />
              </div>

              <form
                onSubmit={formData.handleSubmit(onSubmit)}
                className="w-full space-y-8"
              >
                <div className="space-y-4">
                  <div className="space-y-[8px]">
                    <Label className="text-sm">Họ và tên</Label>
                    <Input
                      {...formData.register("name")}
                      placeholder="họ và tên"
                      className="w-full border rounded-lg p-4"
                    />
                  </div>
                  {formData.formState.errors.name && (
                    <p className="text-sm text-error">
                      {formData.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-[8px]">
                    <Label className="text-sm">Tiểu sử</Label>
                    <Textarea
                      {...formData.register("bio")}
                      placeholder="tiểu sử"
                      className="w-full border rounded-lg p-4"
                    />
                  </div>
                  {formData.formState.errors.bio && (
                    <p className="text-sm text-error">
                      {formData.formState.errors.bio.message}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-[8px]">
                    <Label className="text-sm">Ngày sinh</Label>
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
                  </div>
                  {formData.formState.errors.dateOfBirth && (
                    <p className="text-sm text-error">
                      {formData.formState.errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                <div className="space-y-[4px]">
                  <Label className="text-sm">Giới tính</Label>
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

                <div className="flex justify-center pt-8 border-t">
                  <Button
                    variant="outline"
                    type="submit"
                    className="text-xl font-bold"
                  >
                    Lưu
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
