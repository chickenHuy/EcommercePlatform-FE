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

const brandSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Tên thương hiệu không được để trống",
  }),
  description: z.string().trim(),
});

export default function DialogAddEditBrand(props) {
  const {
    content,
    description,
    nameButton,
    isOpen,
    onClose,
    onSuccess,
    brand,
  } = props;
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (brand) {
      form.reset({
        name: brand.name || "",
        description: brand.description || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [brand, form]);

  const handleSubmit = async (brandData) => {
    try {
      const payload = {
        name: brandData.name.trim(),
        description:
          brandData.description.trim() === ""
            ? null
            : brandData.description.trim(),
      };

      console.log("Payload gửi đi:", payload);

      if (brand && brand.id) {
        await updateBrand(brand.id, payload);
        toast({
          title: "Thành công",
          description: "Thương hiệu đã được cập nhật",
        });
      } else {
        await createBrand(payload);
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
          <DialogTitle>{content}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tên TH
            </Label>
            <Input
              placeholder="tên thương hiệu"
              className="col-span-3"
              {...form.register("name")}
            />
          </div>
          {form.formState.errors.name && (
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-sm text-error col-start-2 col-span-3">
                {form.formState.errors.name.message}
              </p>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Mô tả
            </Label>
            <Input
              placeholder="mô tả"
              className="col-span-3"
              {...form.register("description")}
            />
          </div>
          {form.formState.errors.description && (
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-sm text-error col-start-2 col-span-3">
                {form.formState.errors.description.message}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button type="submit">{nameButton}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
