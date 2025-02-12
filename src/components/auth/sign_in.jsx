"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "../ui/button";
import { EyeOff } from 'lucide-react';
import { Eye } from 'lucide-react';
import Cookies from "js-cookie";
import { post } from "@/lib/httpClient";
import { handleLoginNavigation } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
    username: z.string().min(6, "Tên đăng nhập phải có ít nhất 6 ký tự"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

const SignInComponent = () => {
    const t = useTranslations("AuthPage");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = (data) => {
        setIsLoading(true);
        Cookies.remove(process.env.NEXT_PUBLIC_JWT_NAME, {
            path: "/",
            secure: true,
        });

        post("/api/v1/auths/log-in", data)
            .then((response) => {
                toast({
                    title: "Thông báo",
                    description: "Đăng nhập thành công",
                })
                handleLoginNavigation(response.result.token, router);
                setIsLoading(false);
            })
            .catch((error) => {
                toast({
                    variant: "destructive",
                    title: "Thông báo",
                    description: "Đăng nhập thất bại " + error,
                })
                setIsLoading(false);
            });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full h-fit">
            <div className="mb-5">
                <label className="font-bold text-[16px] block mb-2">{t("username")}</label>
                <input
                    type="text"
                    tabIndex={1}
                    placeholder={t("username")}
                    {...register("username")}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-black-primary outline-none shadow-sm shadow-white-secondary"
                />
                {errors.username && <p className="text-red-primary px-2 text-sm absolute">{errors.username.message}</p>}
            </div>

            <div className="mb-5 relative">
                <label className="font-bold text-[16px] block mb-2">{t("password")}</label>
                <input
                    type={isShowPassword ? "text" : "password"}
                    tabIndex={2}
                    placeholder={t("password")}
                    {...register("password")}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-black-primary outline-none shadow-sm shadow-white-secondary"
                />
                {errors.password && <p className="text-red-primary px-2 text-sm absolute">{errors.password.message}</p>}
                {isShowPassword ? (
                    <Eye className="absolute scale-90 right-4 top-[55%] cursor-pointer" onClick={() => setIsShowPassword(!isShowPassword)} />
                ) : (
                    <EyeOff className="absolute scale-90 right-4 top-[55%] cursor-pointer" onClick={() => setIsShowPassword(!isShowPassword)} />
                )}
            </div>

            <div className="w-full flex items-end justify-center py-4">
                <Button className={`w-1/2 min-w-[200px] h-10 text-white-primary text-[16px] font-bold py-2 px-4 rounded-md shadow-sm shadow-black-secondary relative ${isLoading && 'cursor-wait'}`} type="submit" >
                    {isLoading ? (
                        <div className="global_loading_icon white"></div>
                    ) : t("signIn")}
                </Button>
            </div>
        </form>
    );
};
export default SignInComponent;
