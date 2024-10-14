import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Input } from "@/components/inputs/input";
import { Button } from "@/components/buttons/iconImageButton";

const AccountSchema = z
  .object({
    username: z
      .string()
      .min(6, { message: "USERNAME_INVALID" })
      .max(20, { message: "USERNAME_INVALID" }),
    firstName: z
      .string()
      .min(1, { message: "FIRST_NAME_INVALID" })
      .max(30, { message: "FIRST_NAME_INVALID" }),
    lastName: z
      .string()
      .min(1, { message: "LAST_NAME_INVALID" })
      .max(30, { message: "LAST_NAME_INVALID" }),
    password: z
      .string()
      .min(8, { message: "PASSWORD_INVALID" })
      .max(20, { message: "PASSWORD_INVALID" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: "PASSWORD_FORMAT_INVALID",
      }),
    passwordConfirmation: z
      .string()
      .min(8, { message: "PASSWORD_INVALID" })
      .max(20, { message: "PASSWORD_INVALID" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });

export default function SignUpNow() {
  const t = useTranslations("AuthPage");

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
        passwordConfirmation: "",},
  });

  const onSubmit = (data) => {
    console.log(data);
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
            <p className="text-red-500">{errors.firstName.message}</p>
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
            <p className="text-red-500">{errors.lastName.message}</p>
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
        <p className="text-red-500">{errors.username.message}</p>
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
            <p className="text-red-500">{errors.password.message}</p>
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
            <p className="text-red-500">
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
