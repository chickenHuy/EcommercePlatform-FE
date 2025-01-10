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
    message: "Mô tả không được vượt quá 255 ký tự",
  }),
});

export default function DialogAddEditBrand(props) {
  const {
    title,
    description,
    nameButton,
    onOpen,
    onClose,
    onSuccess,
    brandEdit,
    setIsLoading,
  } = props;

  const [imagePreview, setImagePreview] = useState(
    brandEdit?.logoUrl || brandEmpty
  );
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const { toast } = useToast();

  const brandForm = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (brandEdit) {
      brandForm.reset({
        name: brandEdit.name || "",
        description: brandEdit.description || "",
      });
    } else {
      brandForm.reset({
        name: "",
        description: "",
      });
    }
  }, [brandEdit, brandForm]);

  const onSubmit = async (brandData) => {
    try {
      setIsLoading(true);

      if (!brandEdit && !file) {
        toast({
          title: "Thất bại",
          description: "Vui lòng chọn một logo thương hiệu để thêm mới",
          variant: "destructive",
        });
        return;
      }

      const validTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
      if (file != null && !validTypes.includes(file.type)) {
        toast({
          title: "Thất bại",
          description: "Chỉ chấp nhận các file jpg, jpeg, png, webp",
          variant: "destructive",
        });
        return;
      }

      if (brandEdit) {
        await updateBrand(brandEdit.id, brandData);
        if (file != null) {
          await uploadBrandLogo(brandEdit.id, file);
        }
        toast({
          title: "Thành công",
          description: "Thương hiệu đã được cập nhật",
        });
      } else {
        const brandCreated = await createBrand(brandData);
        await uploadBrandLogo(brandCreated.result.id, file);
        toast({
          title: "Thành công",
          description: "Thương hiệu mới đã được thêm",
        });
      }

      onSuccess();
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
      setFile(tempFile);
      const objectUrl = URL.createObjectURL(tempFile);
      setImagePreview(objectUrl);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Dialog open={onOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[550px] z-[100]">
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
            <div className="col-start-2 min-h-[200px] min-w-[200px] hover:cursor-pointer">
              <Image
                alt="Logo thương hiệu"
                className="aspect-square rounded-md object-cover"
                src={imagePreview}
                width={200}
                height={200}
                unoptimized
                priority
                onClick={handleFileInputClick}
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
