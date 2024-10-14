"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useState } from "react";
import { CircleCheck } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  getAccount,
  updateEmail,
  updatePhone,
} from "@/api/admin/accountRequest";

const accountSchema = z.object({
  username: z.string().trim().min(1, {
    message: "Tên đăng nhập không được để trống",
  }),
  email: z.string().trim().min(1, {
    message: "Email không được để trống",
  }),
  phone: z.string().trim().min(1, {
    message: "Số điện thoại không được để trống",
  }),
});

export default function ManageAccount() {
  const [account, setAccount] = useState([]);
  const { toast } = useToast();
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);

  const formData = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      username: account.username || "",
      email: account.email || "",
      phone: account.phone || "",
    },
  });

  const fetchAccount = useCallback(async () => {
    try {
      const response = await getAccount();
      setAccount(response.result);
      console.log(response.result);
      formData.reset(response.result);
    } catch (error) {
      console.error("Error fetching account:", error);
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [toast, formData]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  const handleUpdateEmail = async () => {
    const isValid = await formData.trigger("email");
    if (isValid) {
      const emailData = {
        userId: account.id,
        email: formData.getValues("email"),
      };
      console.log("Dữ liệu emailData: ", emailData);
      try {
        await updateEmail(emailData);
        toast({
          title: "Thành công",
          description: "Email đã được cập nhật.",
        });
        setAccount({ ...account, email: emailData.email });
        fetchAccount();
      } catch (error) {
        toast({
          title: "Thất bại",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdatePhone = async () => {
    const isValid = await formData.trigger("phone");
    if (isValid) {
      const phoneData = {
        userId: account.id,
        phone: formData.getValues("phone"),
      };
      console.log("Dữ liệu phoneData: ", phoneData);
      try {
        await updatePhone(phoneData);
        toast({
          title: "Thành công",
          description: "Số điện thoại đã được cập nhật.",
        });
        setAccount({ ...account, phone: phoneData.phone });
        fetchAccount();
      } catch (error) {
        toast({
          title: "Thất bại",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleEmailConfirmation = () => {
    setIsEmailConfirmed(true);
  };

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <Toaster />
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Cài đặt chung</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <Link href="http://localhost:3000/en/admin/setting/profile">
            Hồ sơ
          </Link>
          <Link
            href="http://localhost:3000/en/admin/setting/account"
            className="font-semibold text-primary"
          >
            Tài khoản
          </Link>
          <Link href="http://localhost:3000/en/admin/setting/change-password">
            Đổi mật khẩu
          </Link>
        </nav>
        <div className="grid gap-6">
          <Card x-chunk="dashboard-04-chunk-1" className="shadow-lg rounded-lg">
            <CardHeader className="text-center border-b py-6">
              <CardTitle className="text-2xl font-bold">
                Tài khoản của tôi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center gap-6">
              <form
                //onSubmit={formData.handleSubmit}
                className="w-full space-y-4"
              >
                <div>
                  <Label
                    htmlFor="username"
                    className="block text-sm font-medium"
                  >
                    Tên đăng nhập
                  </Label>
                  <div className="w-full space-y-2">
                    <Input
                      {...formData.register("username")}
                      placeholder="tên đăng nhập"
                      className="mt-1 w-full border rounded-lg p-2"
                    />
                    {formData.formState.errors.username && (
                      <p className="text-sm text-error col-start-2 col-span-3">
                        {formData.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex-grow">
                      <Label
                        htmlFor="email"
                        className="block text-sm font-medium"
                      >
                        Email
                      </Label>
                      <Input
                        {...formData.register("email")}
                        placeholder="email"
                        className="mt-1 w-full border rounded-lg p-2"
                      />
                    </div>
                    {isEmailConfirmed && (
                      <CircleCheck className="mt-6 w-5 h-5" />
                    )}
                    <Button
                      type="button"
                      onClick={handleUpdateEmail}
                      className="mt-6 text-sm"
                    >
                      Thay đổi
                    </Button>
                  </div>
                  {formData.formState.errors.email && (
                    <p className="mt-2 text-sm text-error col-start-2 col-span-3">
                      {formData.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  {!isEmailConfirmed ? (
                    <Button
                      className="text-sm"
                      onClick={handleEmailConfirmation}
                    >
                      Xác nhận email
                    </Button>
                  ) : (
                    <span className="text-sm">Email đã xác nhận</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex-grow">
                      <Label
                        htmlFor="phone"
                        className="block text-sm font-medium"
                      >
                        Số điện thoại
                      </Label>
                      <div className="w-full space-y-2">
                        <Input
                          {...formData.register("phone")}
                          placeholder="số điện thoại"
                          className="mt-1 w-full border rounded-lg p-2"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={handleUpdatePhone}
                      className="mt-6 text-sm"
                    >
                      Thay đổi
                    </Button>
                  </div>
                  {formData.formState.errors.phone && (
                    <p className="mt-2 text-sm text-error col-start-2 col-span-3">
                      {formData.formState.errors.phone.message}
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
