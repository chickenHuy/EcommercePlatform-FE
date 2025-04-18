"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updatePassword } from "@/api/user/changePassword";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
  .refine((formData) => formData.newPassword === formData.newPasswordConfirmation, {
    message: "Mật khẩu mới và xác nhận mật khẩu mới không khớp",
    path: ["newPasswordConfirmation"],
  });

export default function ChangePasswordUser() {
  const { toast } = useToast();
  const [loadPage, setLoadPage] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formData = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",
    },
  });

  const resetForm = () => {
    formData.reset();
  };

  const onSubmit = async () => {
    const passwordData = formData.getValues();
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
    <div className="w-full h-fit lg:pl-[300px] flex justify-center items-center">
      <Card className="min-w-[350px] w-[95%] shadow-xl rounded-xl">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-2xl font-bold">Đổi mật khẩu</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center py-8">
          <form
            onSubmit={formData.handleSubmit(onSubmit)}
            className="w-full space-y-7"
          >
            {/* Old Password */}
            <div className="space-y-2">
              <div className="relative space-y-[8px]">
                <span className="text-[1em]">Mật khẩu cũ</span>
                <Input
                  type={showOldPassword ? "text" : "password"}
                  {...formData.register("oldPassword")}
                  placeholder="Mật khẩu cũ"
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer text-muted-foreground"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <EyeOff size={18} className="-translate-y-1" /> : <Eye size={18} className="-translate-y-1" />}
                </span>
              </div>
              {formData.formState.errors.oldPassword && (
                <p className="text-sm text-red-primary">
                  {formData.formState.errors.oldPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <div className="relative space-y-[8px]">
                <span className="text-[1em]">Mật khẩu mới</span>
                <Input
                  type={showNewPassword ? "text" : "password"}
                  {...formData.register("newPassword")}
                  placeholder="Mật khẩu mới"
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer text-muted-foreground"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={18} className="-translate-y-1" /> : <Eye size={18} className="-translate-y-1" />}
                </span>
              </div>
              {formData.formState.errors.newPassword && (
                <p className="text-sm text-red-primary">
                  {formData.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <div className="relative space-y-[8px]">
                <span className="text-[1em]">Xác nhận mật khẩu mới</span>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  {...formData.register("newPasswordConfirmation")}
                  placeholder="Xác nhận mật khẩu mới"
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer text-muted-foreground"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? <EyeOff size={18} className="-translate-y-1" /> : <Eye size={18} className="-translate-y-1" />}
                </span>
              </div>
              {formData.formState.errors.newPasswordConfirmation && (
                <p className="text-sm text-red-primary">
                  {formData.formState.errors.newPasswordConfirmation.message}
                </p>
              )}
            </div>

            <div className="flex justify-center py-8 border-t relative">
              <Button
                type="submit"
              >
                {loadPage ? (
                  <div className="global_loading_icon white"></div>
                ) : "Cập nhật mật khẩu"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
