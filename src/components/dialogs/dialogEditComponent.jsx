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
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  required: z.boolean(),
});

export default function DialogEditComponent(props) {
  const {
    id,
    name,
    icon,
    content,
    nameButton,
    typeDisplay,
    initValue,
    handleSaveChange,
  } = props;
  const [value, setValue] = useState(initValue);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: value,
      required: false,
    },
  });

  const handleSubmit = (data) => {
    handleSaveChange(data, id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {typeDisplay === "button" ? (
          <Button className="w-full h-fit flex flex-row justify-between items-center">
            <span className="block w-full">{name}</span>
            <span className="scale-75">{icon}</span>
          </Button>
        ) : (
          <div className="w-full h-fit flex flex-row justify-between items-center">
            <span className="block w-full">{name}</span>
            <span className="scale-75">{icon}</span>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-center font-extrabold pb-2">
            {content}
          </DialogTitle>
          <DialogDescription>
            {
              "Các sản phẩm trong danh mục này có khả năng bổ sung thành phần vào thông số kỹ thuật."
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-1">
          <Label className="font-semibold">Tên Thành Phần</Label>
          <Input
            value={value}
            placeholder="Tên thành phần"
            {...form.register("name")}
            onChange={(e) => setValue(e.target.value)}
          />
          {form.formState.errors.name && (
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-sm text-error col-start-2 col-span-3">
                {form.formState.errors.name.message}
              </p>
            </div>
          )}
          <div className="flex items-center justify-start gap-2 py-3">
            <Checkbox
              id="required"
              checked={form.watch("required")}
              onCheckedChange={(checked) => form.setValue("required", checked)}
            />
            <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Bắt buộc
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="scale-75">
                  <HelpOutlineIcon />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {
                      "Khi người bán thêm thông số kỹ thuật này vào sản phẩm của mình, họ bắt buộc phải nhập giá trị hợp lệ cho nó."
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <DialogFooter>
            <Button type="submit">{nameButton}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
