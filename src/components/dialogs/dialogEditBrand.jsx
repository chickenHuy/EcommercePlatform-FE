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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { post } from "@/lib/httpClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string(),
});

export default function DialogEditBrand(props) {
  const { content, description, nameButton, isOpen, onClose } = props;
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleSubmit = (data) => {
    editBrand(data);
  };

  function editBrand(data) {
    post("/api/v1/brands", data)
      .then((res) => {
        toast({
          title: "Thành công",
          description: "Cập nhật thành phần thành công",
        });
      })
      .catch((error) => {
        toast({
          title: "Thất bại",
          description: error.message,
          variant: "destructive",
        });
      });
  }

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
