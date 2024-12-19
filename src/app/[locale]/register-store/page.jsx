"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getAccountStore,
  registerStore,
} from "@/api/register-store/registerStoreRequest";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/lib/httpClient";
import { CircularProgress } from "@mui/material";
import { Textarea } from "@/components/ui/textarea";

const registerStoreSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, {
      message: "Tên cửa hàng phải từ 3 đến 30 ký tự",
    })
    .max(30, {
      message: "Tên cửa hàng phải từ 3 đến 30 ký tự",
    }),
  bio: z.string().trim().max(255, {
    message: "Bio không được vượt quá 255 ký tự",
  }),
});

export default function RegisterStore() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

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
  };

  const handleCancel = () => {
    router.push("/auth");
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <Toaster />
      {isLoading ? (
        <div className="fixed inset-0 flex flex-col justify-center items-center z-[100] space-y-4 bg-black-secondary">
          <CircularProgress />
          <p className="text-2xl text-white-primary">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Đăng ký trở thành người bán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={registerStoreForm.handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input
                    id="username"
                    placeholder="tên đăng nhập"
                    value={username}
                    disabled
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Tên cửa hàng</Label>
                  <Input
                    id="name"
                    placeholder="tên cửa hàng"
                    className="col-span-3"
                    {...registerStoreForm.register("name")}
                  />
                  {registerStoreForm.formState.errors.name && (
                    <p className="text-sm text-error">
                      {registerStoreForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="bio"
                    className="col-span-3"
                    {...registerStoreForm.register("bio")}
                  />
                  {registerStoreForm.formState.errors.bio && (
                    <p className="text-sm text-error">
                      {registerStoreForm.formState.errors.bio.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
                <Button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto"
                >
                  Hủy bỏ
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  Đăng ký
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
