"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import {
  createBrand,
  updateBrand,
  uploadBrandLogo,
} from "@/api/admin/brandRequest";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import brandEmpty from "@/assets/images/brandEmpty.jpg";
import { X } from "lucide-react";

const validImageTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

const brandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, {
      message: "Tên thương hiệu phải từ 2 đến 30 ký tự",
    })
    .max(30, {
      message: "Tên thương hiệu phải từ 2 đến 30 ký tự",
    }),
  description: z.string().trim().max(255, {
    message: "Mô tả phải không vượt quá 255 ký tự",
  }),
  logoUrl: z
    .any()
    .refine(
      (file) => {
        if (!file) return false;
        if (typeof file === "string") return true;
        return validImageTypes.includes(file.type);
      },
      {
        message: "Hình ảnh phải có dạng jpg, jpeg, png hoặc webp",
      }
    )
    .optional(),
});

export default function DialogAddEditBrand(props) {
  const {
    title,
    description,
    nameButton,
    onOpen,
    onClose,
    refreshPage,
    brandEdit,
    setIsLoading,
  } = props;

  const fileInputRef = useRef(null);
  const [fileLogoUrl, setFileLogoUrl] = useState(null);

  const { toast } = useToast();

  const brandForm = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: brandEmpty,
    },
  });

  useEffect(() => {
    if (brandEdit) {
      brandForm.reset({
        name: brandEdit.name,
        description: brandEdit.description,
        logoUrl: brandEdit.logoUrl,
      });
    }
  }, [brandEdit, brandForm]);

  const onSubmit = async (brandData) => {
    try {
      setIsLoading(true);

      if (!brandEdit && !fileLogoUrl) {
        toast({
          title: "Thất bại",
          description: "Vui lòng chọn một logo thương hiệu để thêm mới",
          variant: "destructive",
        });
        return;
      }

      if (brandEdit) {
        await updateBrand(brandEdit.id, brandData);
        if (fileLogoUrl) {
          await uploadBrandLogo(brandEdit.id, fileLogoUrl);
        }
        toast({
          description: `Chỉnh sửa thương hiệu "${brandData.name}" thành công`,
        });
      } else {
        const brandCreated = await createBrand(brandData);
        await uploadBrandLogo(brandCreated.result.id, fileLogoUrl);
        toast({
          description: `Thêm mới thương hiệu "${brandData.name}" thành công`,
        });
      }

      refreshPage();
      onClose();
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const tempFile = event.target.files[0];
    if (tempFile) {
      setFileLogoUrl(tempFile);
      brandForm.setValue("logoUrl", tempFile);
      brandForm.trigger("logoUrl");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Dialog open={onOpen} onOpenChange={onClose}>
      <DialogContent className="z-[200] max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={brandForm.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Tên TH</Label>
            <Input
              placeholder="tên thương hiệu"
              className="col-span-3"
              {...brandForm.register("name")}
            />
          </div>
          {brandForm.formState.errors.name && (
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-sm text-error col-start-2 col-span-3">
                {brandForm.formState.errors.name.message}
              </p>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Mô tả</Label>
            <Textarea
              placeholder="mô tả"
              className="col-span-3 min-h-[100px]"
              {...brandForm.register("description")}
            />
          </div>
          {brandForm.formState.errors.description && (
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-sm text-error col-start-2 col-span-3">
                {brandForm.formState.errors.description.message}
              </p>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Logo</Label>
            <div
              className="col-start-2 min-h-[200px] min-w-[200px] hover:cursor-pointer"
              onClick={handleFileInputClick}
            >
              <Image
                alt="Logo thương hiệu"
                className="aspect-square rounded-md object-cover"
                src={
                  fileLogoUrl
                    ? URL.createObjectURL(fileLogoUrl)
                    : brandForm.watch("logoUrl")
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
                onChange={(e) => handleFileChange(e)}
                style={{ display: "none" }}
              />
            </div>
          </div>
          {brandForm.formState.errors.logoUrl && (
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-sm text-error col-start-2 col-span-3">
                {brandForm.formState.errors.logoUrl.message}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" variant="outline">
              {nameButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
