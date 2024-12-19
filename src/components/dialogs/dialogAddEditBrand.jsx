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
import { useEffect } from "react";
import { createBrand, updateBrand } from "@/api/admin/brandRequest";
import { Textarea } from "../ui/textarea";

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
    isOpen,
    onClose,
    onSuccess,
    brandDataEdit,
  } = props;

  const { toast } = useToast();

  const brandForm = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (brandDataEdit) {
      brandForm.reset({
        name: brandDataEdit.name || "",
        description: brandDataEdit.description || "",
      });
    } else {
      brandForm.reset({
        name: "",
        description: "",
      });
    }
  }, [brandDataEdit, brandForm]);

  const onSubmit = async (brandData) => {
    try {
      if (brandDataEdit) {
        await updateBrand(brandDataEdit.id, brandData);
        toast({
          title: "Thành công",
          description: "Thương hiệu đã được cập nhật",
        });
      } else {
        await createBrand(brandData);
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
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={brandForm.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tên TH
            </Label>
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
            <Label htmlFor="description" className="text-right">
              Mô tả
            </Label>
            <Textarea
              placeholder="mô tả"
              className="col-span-3"
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
