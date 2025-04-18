"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import {
  getProfile,
  updateProfile,
  uploadUserImage,
} from "@/api/user/profileRequest";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/dayTimePicker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useToast } from "@/hooks/use-toast";

import BrandEmpty from "@/assets/images/brandEmpty.jpg";
import Loading from "@/components/loading";
import { useTranslations } from "next-intl";

export default function ManageProfile() {
  const fileInputRef = useRef(null);
  const validImageTypes = ["image/jpg", "image/jpeg", "image/png"];
  const { toast } = useToast();
  const t = useTranslations("User.profile");

  const [userId, setUserId] = useState("");
  const [fileImageUrl, setFileImageUrl] = useState(null);
  const [loadPage, setLoadPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const profileSchema = z.object({
    imageUrl: z
      .any()
      .refine(
        (file) => !file || typeof file === "string" || validImageTypes.includes(file.type),
        { message: t('image_error') }
      )
      .optional(),
    name: z.string().trim().min(2, t('name_error')).max(50),
    bio: z.string().trim().max(255, t('bio_error')).nullable(),
    dateOfBirth: z
      .preprocess((arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg), z.date().nullable())
      .refine((date) => date !== null, { message: t('date_of_birth_error') }),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).nullable().refine(value => value !== null, { message: t('gender_error') }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
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
      reset({ ...response.result, imageUrl: response.result.imageUrl || BrandEmpty, dateOfBirth: response.result.dateOfBirth ? new Date(response.result.dateOfBirth) : null });
    } catch (error) {
      toast({ title: t('notify'), description: error.message, variant: "destructive" });
    } finally {
      setLoadPage(false);
    }
  }, [toast, reset]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onSubmit = async (profileData) => {
    setIsLoading(true);

    const editedData = {
      ...profileData,
      dateOfBirth: profileData.dateOfBirth?.toLocaleDateString("sv-SE") || new Date().toLocaleDateString("sv-SE"),
    };

    try {
      await updateProfile(userId, editedData);
      if (fileImageUrl) await uploadUserImage(fileImageUrl);
      toast({ title: t('notify'), description: t('update_success') });
      window.location.reload();
    } catch (error) {
      toast({ title: t('notify'), description: error.message, variant: "destructive" });
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const tempFile = event.target.files[0];
    if (tempFile) {
      setFileImageUrl(tempFile);
      setValue("imageUrl", tempFile);
      trigger("imageUrl");
    }
  };

  return (
    <>
      {loadPage ? (
        <div className="w-full h-fit lg:pl-[300px] relative">
          <Loading />
        </div>
      ) : (
        <div className="w-full h-fit lg:pl-[300px] flex justify-center items-center">
          <Card className="min-w-[350px] w-[95%] shadow-md rounded-md">
            <CardHeader className="text-center border-b">
              <span className="text-[1.7em]">{t('my_profile')}</span>
            </CardHeader>

            <CardContent className="flex flex-col items-center py-8">
              <div className="cursor-pointer mb-3" onClick={() => fileInputRef.current.click()}>
                <Image
                  alt="Ảnh đại diện"
                  className="aspect-square rounded-md object-cover shadow-md shadow-white-secondary hover:shadow-white-tertiary"
                  src={fileImageUrl ? URL.createObjectURL(fileImageUrl) : watch("imageUrl")}
                  width={250}
                  height={250}
                />
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
              {errors.imageUrl && <p className="text-sm text-red-primary">{errors.imageUrl.message}</p>}

              <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
                <div className="space-y-1">
                  <span className="text-[1em]">{t('name')}</span>
                  <Input {...register("name")} placeholder={t('name')} className="w-full border rounded-lg p-4" />
                  {errors.name && <p className="text-sm text-red-primary">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                  <span className="text-[1em]">{t('bio')}</span>
                  <Textarea {...register("bio")} placeholder={t('bio')} className="w-full border rounded-lg p-4" />
                  {errors.bio && <p className="text-sm text-red-primary">{errors.bio.message}</p>}
                </div>

                <div className="space-y-1">
                  <span className="text-[1em]">{t('date_of_birth')}</span>
                  <Controller name="dateOfBirth" control={control} render={({ field }) => <DatePicker date={field.value} setDate={field.onChange} />} />
                  {errors.dateOfBirth && <p className="text-sm text-red-primary">{errors.dateOfBirth.message}</p>}
                </div>

                <div className="space-y-[4px]">
                  <span className="text-[1em]">{t('gender')}</span>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup value={field.value} onValueChange={field.onChange} className="flex items-center space-x-6 py-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="MALE" id="MALE" />
                          <span>{t('gender_male')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="FEMALE" id="FEMALE" />
                          <span>{t('gender_female')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="OTHER" id="OTHER" />
                          <span>{t('gender_other')}</span>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.gender && <p className="text-sm text-red-primary">{errors.gender.message}</p>}
                </div>

                <div className="flex justify-center pt-8 border-t">
                  <Button type="submit" className="text-[1em] px-20 shadow-md shadow-white-tertiary relative">
                    {
                      isLoading ? (
                        <div className="global_loading_icon white"></div>
                      ) : t('update')
                    }
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
