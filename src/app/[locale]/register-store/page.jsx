"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import Cookies from "js-cookie";
import { refreshToken } from "@/lib/httpClient";

const registerStoreSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Tên cửa hàng không được để trống",
  }),
  bio: z.string().trim(),
});

export default function RegisterStore() {
  const [username, setUsername] = useState("");
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
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchAccountStore();
  }, []);

  const handleSubmit = async (data) => {
    const payload = {
      name: data.name.trim(),
      bio: data.bio.trim() === "" ? null : data.bio.trim(),
    };

    try {
      await registerStore(payload);
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Đăng ký trở thành người bán</CardTitle>
          <CardDescription>
            Nhập đầy đủ thông tin để đăng ký trở thành người bán
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={registerStoreForm.handleSubmit(handleSubmit)}>
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
              </div>
              {registerStoreForm.formState.errors.name && (
                <div className="flex flex-col space-y-1.5">
                  <p className="text-sm text-error col-start-2 col-span-3">
                    {registerStoreForm.formState.errors.name.message}
                  </p>
                </div>
              )}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  placeholder="bio"
                  className="col-span-3"
                  {...registerStoreForm.register("bio")}
                />
              </div>
              {registerStoreForm.formState.errors.bio && (
                <div className="flex flex-col space-y-1.5">
                  <p className="text-sm text-error col-start-2 col-span-3">
                    {registerStoreForm.formState.errors.bio.message}
                  </p>
                </div>
              )}
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
    </main>
  );
}
