"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/api/user/changePassword";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().trim(),
    newPassword: z
      .string()
      .trim()
      .min(8, { message: "Mật khẩu mới phải có trên 8 và dưới 20 ký tự" })
      .max(20, { message: "Mật khẩu mới phải có trên 8 và dưới 20 ký tự" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message:
          "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường và một số",
      }),
    newPasswordConfirmation: z.string().trim(),
  })
  .refine(
    (formData) => formData.newPassword === formData.newPasswordConfirmation,
    {
      message: "Mật khẩu mới và xác nhận mật khẩu mới không khớp",
      path: ["newPasswordConfirmation"],
    }
  );

export default function ManageChangePassword() {
  const { toast } = useToast();

  const formData = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",
    },
  });

  const fetchChangePassword = () => {
    formData.reset({
      oldPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",
    });
  };

  const onSubmit = async () => {
    const passwordData = {
      oldPassword: formData.getValues("oldPassword"),
      newPassword: formData.getValues("newPassword"),
      newPasswordConfirmation: formData.getValues("newPasswordConfirmation"),
    };
    console.log("Dữ liệu passwordData: ", passwordData);
    try {
      await updatePassword(passwordData);
      toast({
        title: "Thành công",
        description: "Mật khẩu đã được cập nhật",
      });
      fetchChangePassword();
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card x-chunk="dashboard-04-chunk-1" className="shadow-lg rounded-lg">
      <CardHeader className="text-center border-b py-6">
        <CardTitle className="text-2xl font-bold">Đổi mật khẩu</CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center gap-6">
        <form
          onSubmit={formData.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <div>
            <div>
              <Label
                htmlFor="oldPassword"
                className="block text-sm font-medium"
              >
                Mật khẩu cũ
              </Label>
              <Input
                type="password"
                {...formData.register("oldPassword")}
                placeholder="Mật khẩu cũ"
                className="mt-1 w-full border rounded-lg p-2"
              />
            </div>
            {formData.formState.errors.oldPassword && (
              <p className="mt-2 text-sm text-error col-start-2 col-span-3">
                {formData.formState.errors.oldPassword.message}
              </p>
            )}
          </div>
          <div>
            <div>
              <Label
                htmlFor="newPassword"
                className="block text-sm font-medium"
              >
                Mật khẩu mới
              </Label>
              <Input
                type="password"
                {...formData.register("newPassword")}
                placeholder="Mật khẩu mới"
                className="mt-1 w-full border rounded-lg p-2"
              />
            </div>
            {formData.formState.errors.newPassword && (
              <p className="mt-2 text-sm text-error col-start-2 col-span-3">
                {formData.formState.errors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <div>
              <Label
                htmlFor="newPasswordConfirmation"
                className="block text-sm font-medium"
              >
                Xác nhận mật khẩu mới
              </Label>
              <Input
                type="password"
                {...formData.register("newPasswordConfirmation")}
                placeholder="Xác nhận mật khẩu mới"
                className="mt-1 w-full border rounded-lg p-2"
              />
            </div>
            {formData.formState.errors.newPasswordConfirmation && (
              <p className="mt-2 text-sm text-error col-start-2 col-span-3">
                {formData.formState.errors.newPasswordConfirmation.message}
              </p>
            )}
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
