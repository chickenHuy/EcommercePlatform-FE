import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Input } from "@/components/inputs/input";
import { Button } from "@/components/buttons/iconImageButton";
import { post } from "@/lib/httpClient";
import { useToast } from "@/hooks/use-toast";

const AccountSchema = z
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

export default function SignUpNow() {
  const t = useTranslations("AuthPage");
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await post("/api/v1/users", data);
      if (response.code === 1000) {
        toast({
          title: "Đăng ký thành công, vui lòng đăng nhập.",
          description: response.message,
        })
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full flex flex-row items-center justify-between">
        <div className="w-[48%]">
          <span className="font-bold text-[16px] block my-2">
            {t("firstName")}
          </span>
          <Input
            type="text"
            placeholder={t("firstName")}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-error text-sm">{errors.firstName.message}</p>
          )}
        </div>
        <div className="w-[48%]">
          <span className="font-bold text-[16px] block my-2">
            {t("lastName")}
          </span>
          <Input
            type="text"
            placeholder={t("lastName")}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-error text-sm">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      <span className="font-bold text-[16px] block my-2">{t("username")}</span>
      <Input
        type="text"
        placeholder={t("username")}
        {...register("username")}
      />
      {errors.username && (
        <p className="text-error text-sm">{errors.username.message}</p>
      )}
      <div className="w-full flex flex-row items-center justify-between">
        <div className="w-[48%]">
          <span className="font-bold text-[16px] block my-2">
            {t("password")}
          </span>
          <Input
            type="password"
            placeholder={t("password")}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-error text-sm">{errors.password.message}</p>
          )}
        </div>
        <div className="w-[48%]">
          <span className="font-bold text-[16px] block my-2">
            {t("confirmPassword")}
          </span>
          <Input
            type="password"
            placeholder={t("confirmPassword")}
            {...register("passwordConfirmation")}
          />
          {errors.passwordConfirmation && (
            <p className="text-error text-sm">
              {errors.passwordConfirmation.message}
            </p>
          )}
        </div>
      </div>
      <div className="mt-5 mb-4">
        <Button
          type="submit"
          text={t("signUp")}
          width="w-full"
          height="h-14"
          backgroundColor="bg-black-primary"
          textColor="text-white-primary"
        />
      </div>
    </form>
  );
}
