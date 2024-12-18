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
import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Họ và tên không được để trống",
  }),
  bio: z.string().trim(),
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
  const [profile, setProfile] = useState([]);
  const [imgUrl, setImgUrl] = useState(null);
  const { toast } = useToast();

  const formData = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      bio: "",
      dateOfBirth: null,
      gender: "MALE",
    },
  });

  const fetchProfile = useCallback(async () => {
    try {
      const response = await getProfile();
      setProfile(response.result);
      setImgUrl(response.result.imageUrl);
      formData.reset(response.result);
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [toast, formData]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, imgUrl]);

  const onSubmit = async (profileData) => {
    const payload = {
      ...profileData,
      bio: profileData.bio.trim() === "" ? null : profileData.bio.trim(),
      dateOfBirth: profileData.dateOfBirth
        ? new Date(profileData.dateOfBirth).toLocaleDateString("sv-SE")
        : null,
    };

    try {
      const updated = await updateProfile(profile.id, payload);
      toast({
        title: "Thành công",
        description: "Thông tin hồ sơ đã được cập nhật",
      });
      setProfile(updated.result);
      fetchProfile();
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Thất bại",
        description: "Chỉ chấp nhận các tệp JPG hoặc PNG",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await uploadUserImage(file);
      toast({
        title: "Thành công",
        description: "Thay đổi ảnh đại diện thành công",
      });
      setImgUrl(response.result.imageUrl);
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader className="text-center border-b py-6">
        <CardTitle className="text-2xl font-bold">Hồ sơ của tôi</CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center gap-6">
        <label htmlFor="profileImageUpload" className="cursor-pointer">
          <Avatar className="w-40 h-40 rounded-full mx-auto border-2">
            <AvatarImage src={imgUrl ? imgUrl : null} alt="Ảnh đại diện" />
            <AvatarFallback>{profile.username}</AvatarFallback>
          </Avatar>
          <input
            type="file"
            id="profileImageUpload"
            accept="image/jpeg, image/png"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </label>
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
            <Label htmlFor="dateOfBirth" className="block text-sm font-medium">
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
  );
}
