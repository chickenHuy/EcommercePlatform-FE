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
import { useTranslations } from "next-intl";

export default function ChangePasswordUser() {
  const { toast } = useToast();
  const t = useTranslations("User.change_password");
  const [loadPage, setLoadPage] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const changePasswordSchema = z
    .object({
      oldPassword: z.string().trim(),
      newPassword: z
        .string()
        .trim()
        .min(8, { message: t('new_password_length') })
        .max(20, { message: t('new_password_length') })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
          message:
            t('new_password_pattern')
        }),
      newPasswordConfirmation: z.string().trim(),
    })
    .refine((formData) => formData.newPassword === formData.newPasswordConfirmation, {
      message: t('confirm_not_match'),
      path: ["newPasswordConfirmation"],
    });


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
        title: t('notify'),
        description: t('message'),
      });
      resetForm();
    } catch (error) {
      toast({
        title: t('notify'),
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
          <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center py-8">
          <form
            onSubmit={formData.handleSubmit(onSubmit)}
            className="w-full space-y-7"
          >
            <div className="space-y-2">
              <div className="relative space-y-[8px]">
                <span className="text-[1em]">{t('old_password')}</span>
                <Input
                  type={showOldPassword ? "text" : "password"}
                  {...formData.register("oldPassword")}
                  placeholder={t('old_password')}
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

            <div className="space-y-2">
              <div className="relative space-y-[8px]">
                <span className="text-[1em]">{t('new_password')}</span>
                <Input
                  type={showNewPassword ? "text" : "password"}
                  {...formData.register("newPassword")}
                  placeholder={t('new_password')}
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

            <div className="space-y-2">
              <div className="relative space-y-[8px]">
                <span className="text-[1em]">{t('confirm_new_password')}</span>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  {...formData.register("newPasswordConfirmation")}
                  placeholder={t('confirm_new_password')}
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
                ) : t('submit')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
