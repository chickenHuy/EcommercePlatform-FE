"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/api/user/changePassword";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CircularProgress } from "@mui/material";

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

export default function ChangePasswordUser() {
  const { toast } = useToast();
  const [loadPage, setLoadPage] = useState(false);

  const formData = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",
    },
  });

  const resetForm = () => {
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
    setLoadPage(true);
    try {
      await updatePassword(passwordData);
      toast({
        title: "Thành công",
        description: "Mật khẩu đã được cập nhật",
      });
      resetForm();
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadPage(false);
    }
  };

  return (
    <>
      {loadPage && (
        <div className="fixed inset-0 flex flex-col justify-center items-center z-[150] space-y-4 bg-black-primary">
          <CircularProgress />
          <Label className="text-2xl text-white-primary">
            Đang tải dữ liệu...
          </Label>
        </div>
      )}

      {!loadPage && (
        <div className="flex justify-center items-center">
          <Card className="w-full min-w-[600px] max-w-[1200px] shadow-xl rounded-xl">
            <CardHeader className="text-center border-b">
              <CardTitle className="text-2xl font-bold">Đổi mật khẩu</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center py-8">
              <form
                onSubmit={formData.handleSubmit(onSubmit)}
                className="w-full space-y-8"
              >
                <div className="space-y-4">
                  <div className="space-y-[8px]">
                    <Label className="text-sm">Mật khẩu cũ</Label>
                    <Input
                      type="password"
                      {...formData.register("oldPassword")}
                      placeholder="Mật khẩu cũ"
                      className="w-full border rounded-lg p-4"
                    />
                  </div>
                  {formData.formState.errors.oldPassword && (
                    <p className="text-sm text-error">
                      {formData.formState.errors.oldPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-[8px]">
                    <Label className="text-sm">Mật khẩu mới</Label>
                    <Input
                      type="password"
                      {...formData.register("newPassword")}
                      placeholder="Mật khẩu mới"
                      className="w-full border rounded-lg p-4"
                    />
                  </div>
                  {formData.formState.errors.newPassword && (
                    <p className="text-sm text-error">
                      {formData.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-[8px]">
                    <Label className="text-sm">Xác nhận mật khẩu mới</Label>
                    <Input
                      type="password"
                      {...formData.register("newPasswordConfirmation")}
                      placeholder="Xác nhận mật khẩu mới"
                      className="w-full border rounded-lg p-4"
                    />
                  </div>
                  {formData.formState.errors.newPasswordConfirmation && (
                    <p className="text-sm text-error">
                      {
                        formData.formState.errors.newPasswordConfirmation
                          .message
                      }
                    </p>
                  )}
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
