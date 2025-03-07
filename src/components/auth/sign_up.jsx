import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { post } from "@/lib/httpClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { useState } from "react";
import { EyeOff } from 'lucide-react';
import { Eye } from 'lucide-react';

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(6, { message: "Username phải có ít nhất 6 ký tự" })
      .max(20, { message: "Username phải có độ dài tối đa 20 ký tự" }),
    firstName: z
      .string()
      .min(1, { message: "Không được để trống " })
      .max(30, { message: "Độ dài không vượt quá 30 ký tự" }),
    lastName: z
      .string()
      .min(1, { message: "Không được để trống " })
      .max(30, { message: "Mật khẩu phải có độ dài không vượt quá 30 ký tự" }),
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải ít 8 ký tự" })
      .max(20, { message: "Mật khẩu có độ dài tối đa 20 ký tự" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: "Mật khẩu phải chứa số, chữ thường và chữ hoa",
      }),
    passwordConfirmation: z
      .string()
      .min(8, { message: "Mật khẩu phải ít 8 ký tự" })
      .max(20, { message: "Mật khẩu có độ dài tối đa 20 ký tự" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Mật khẩu không khớp",
    path: ["passwordConfirmation"],
  });

export default function SignUpComponent(props) {
  const { setIsSignIn } = props;
  const { toast } = useToast();
  const t = useTranslations("AuthPage");
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(
    {
      resolver: zodResolver(signUpSchema),
    }
  );

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await post("/api/v1/users", data);
      if (response.code === 1000) {
        toast({
          title: "Thông báo",
          description: "Đăng ký thành công",
        })
        setIsSignIn(true);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thông báo",
        description: error.message,
      });
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full h-fit">
      <div className="w-full flex flex-row items-center justify-between gap-3">
        <div className="mb-5">
          <label className="font-bold text-[16px] block mb-1">{t("firstName")}</label>
          <input
            type="text"
            tabIndex={1}
            placeholder={t("firstName")}
            {...register("firstName")}
            className="w-full p-2 border border-gray-300 rounded-md focus:border-black-primary outline-none shadow-sm shadow-white-secondary"
          />
          {errors.firstName && (
            <p className="text-red-primary absolute text-sm">{errors.firstName.message}</p>
          )}
        </div>
        <div className="mb-5">
          <label className="font-bold text-[16px] block mb-1">{t("lastName")}</label>
          <input
            type="text"
            tabIndex={2}
            placeholder={t("lastName")}
            {...register("lastName")}
            className="w-full p-2 border border-gray-300 rounded-md focus:border-black-primary outline-none shadow-sm shadow-white-secondary"
          />
          {errors.lastName && (
            <p className="text-red-primary absolute text-sm">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="mb-5">
        <label className="font-bold text-[16px] block mb-1">{t("username")}</label>
        <input
          type="text"
          tabIndex={3}
          placeholder={t("username")}
          {...register("username")}
          className="w-full p-2 border border-gray-300 rounded-md focus:border-black-primary outline-none shadow-sm shadow-white-secondary"
        />
        {errors.username && (
          <p className="text-red-primary absolute text-sm">{errors.username.message}</p>
        )}
      </div>
      <div className="w-full flex flex-row items-center justify-between gap-3">
        <div className="mb-5 relative">
          <label className="font-bold text-[16px] block mb-1">{t("password")}</label>
          <input
            tabIndex={4}
            type={isShowPassword ? "text" : "password"}
            placeholder={t("password")}
            {...register("password")}
            className="w-full p-2 pr-12 border border-gray-300 rounded-md focus:border-black-primary outline-none shadow-sm shadow-white-secondary"
          />
          {errors.password && (
            <p className="text-red-primary absolute text-sm">{errors.password.message}</p>
          )}
          {isShowPassword ? (
            <Eye className="absolute scale-90 right-4 top-[55%] cursor-pointer" onClick={() => setIsShowPassword(!isShowPassword)} />
          ) : (
            <EyeOff className="absolute scale-90 right-4 top-[55%] cursor-pointer" onClick={() => setIsShowPassword(!isShowPassword)} />
          )}
        </div>
        <div className="mb-5 relative">
          <label className="font-bold text-[16px] block mb-1">{t("confirmPassword")}</label>
          <input
            tabIndex={5}
            type={isShowPassword ? "text" : "password"}
            placeholder={t("confirmPassword")}
            {...register("passwordConfirmation")}
            className="w-full p-2 pr-12 border border-gray-300 rounded-md focus:border-black-primary outline-none shadow-sm shadow-white-secondary"
          />
          {errors.passwordConfirmation && (
            <p className="text-red-primary absolute text-sm">
              {errors.passwordConfirmation.message}
            </p>
          )}
          {isShowPassword ? (
            <Eye className="absolute scale-90 right-4 top-[55%] cursor-pointer" onClick={() => setIsShowPassword(!isShowPassword)} />
          ) : (
            <EyeOff className="absolute scale-90 right-4 top-[55%] cursor-pointer" onClick={() => setIsShowPassword(!isShowPassword)} />
          )}
        </div>
      </div>
      <div className="w-full flex items-end justify-center py-4">
        <Button className="w-1/2 min-w-[200px] h-10 text-white-primary text-[16px] font-bold py-2 px-4 rounded-md shadow-sm shadow-black-secondary relative" type="submit" >
          {isLoading ? (
            <div className="global_loading_icon white"></div>
          ) : t("signUp")}
        </Button>
      </div>
    </form>
  );
}
