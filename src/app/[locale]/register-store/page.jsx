"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"
import {
  getAccountStore,
  registerStore,
} from "@/api/register-store/registerStoreRequest";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/lib/httpClient";
import { useTranslations } from "next-intl";
import Loading from "@/components/loading";


export default function RegisterStore() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("VendorRegister");

  const registerStoreSchema = z.object({
    name: z
      .string()
      .trim()
      .min(3, {
        message: t("store_name_validation"),
      })
      .max(30, {
        message: t("store_name_validation"),
      }),
    bio: z.string().trim().max(255, {
      message: t("bio_validation"),
    }),
  });

  const registerStoreForm = useForm({
    resolver: zodResolver(registerStoreSchema),
    defaultValues: {
      name: "",
      bio: "",
    },
  });

  useEffect(() => {
    const fetchAccountStore = async () => {
      try {
        const response = await getAccountStore();
        setUsername(response.result.username);
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Thất bại",
          description:
            error.message === "Unauthenticated"
              ? "Phiên làm việc hết hạn. Vui lòng đăng nhập lại!!!"
              : error.message,
          variant: "destructive",
        });
      }
    };
    fetchAccountStore();
  }, [toast]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await registerStore(data);
      toast({
        title: "Thành công",
        description: "Bạn đã đăng ký cửa hàng thành công",
      });
      await refreshToken();
      router.push("/vendor");
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    router.push("/");
  };

  return (
    <main className="flex items-start justify-center min-h-screen p-5 pt-36">
      <Toaster />
      {isLoading ? (
        <Loading />
      ) : (
        <Card className="w-full xl:w-1/2 max-w-2xl">
          <CardHeader>
            <CardTitle className="text-[1.5em] font-bold text-center">
              {t("register_store")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={registerStoreForm.handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4 text-[1em]">
                <div className="flex flex-col space-y-1.5">
                  <span className="font-bold">{t("username")}</span>
                  <Input
                    id="username"
                    placeholder={t("username")}
                    value={username}
                    disabled
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <span className="font-bold">{t("store_name")}</span>
                  <Input
                    id="name"
                    placeholder={t("store_name")}
                    className="col-span-3"
                    {...registerStoreForm.register("name")}
                  />
                  {registerStoreForm.formState.errors.name && (
                    <p className="text-sm text-red-primary">
                      {registerStoreForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <span className="font-bold">{t("bio")}</span>
                  <Textarea
                    id="bio"
                    placeholder={t("bio")}
                    className="col-span-3"
                    {...registerStoreForm.register("bio")}
                  />
                  {registerStoreForm.formState.errors.bio && (
                    <p className="text-sm text-red-primary">
                      {registerStoreForm.formState.errors.bio.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 font-bold">
                <Button
                  type="button"
                  onClick={handleCancel}
                  className={`w-full h-10 text-[1em] shadow-sm shadow-black-secondary ${isSubmitting && 'cursor-not-allowed'} `}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" className={`w-full h-10 text-[1em] shadow-sm shadow-black-secondary relative ${isSubmitting && "cursor-wait"}`}>
                  {isSubmitting ? <div className="global_loading_icon white"></div> : t("register")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
