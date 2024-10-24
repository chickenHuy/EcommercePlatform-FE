"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  sendMailValidation,
  updateEmail,
  updatePhone,
} from "@/api/user/accountRequest";

const accountSchema = z.object({
  email: z.string().trim().email({
    message: "Email không hợp lệ",
  }),
  phone: z
    .string()
    .trim()
    .regex(/^0\d{9}$/, {
      message:
        "Số điện thoại phải gồm 10 chữ số, không chứa ký tự đặc biệt và phải bắt đầu là số 0",
    }),
});

export default function ManageAccount() {
  const [account, setAccount] = useState([]);
  const { toast } = useToast();

  const formData = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      email: "",
      phone: "",
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
          description: "Email đã được cập nhật",
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
          description: "Số điện thoại đã được cập nhật",
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

  const handleSendMailValidation = async () => {
    try {
      await sendMailValidation();
      toast({
        title: "Thành công",
        description: "Vui lòng vào email của bạn để thực hiện xác thực",
        variant: "success",
      });
      fetchAccount();
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card x-chunk="dashboard-04-chunk-1" className="shadow-lg rounded-lg">
      <CardHeader className="text-center border-b py-6">
        <CardTitle className="text-2xl font-bold">Tài khoản của tôi</CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center gap-6">
        <form className="w-full space-y-4">
          <div>
            <Label htmlFor="username" className="block text-sm font-medium">
              Tên đăng nhập
            </Label>
            <div className="w-full space-y-2">
              <Input
                value={account.username || ""}
                readOnly
                placeholder="tên đăng nhập"
                className="mt-1 w-full border rounded-lg p-2"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="flex-grow">
                <Label htmlFor="email" className="block text-sm font-medium">
                  Email
                </Label>
                <Input
                  {...formData.register("email")}
                  placeholder="email"
                  className="mt-1 w-full border rounded-lg p-2"
                />
              </div>
              {account.emailValidationStatus === "VERIFIED" && (
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
            {account.emailValidationStatus !== "VERIFIED" && (
              <Button
                type="button"
                onClick={handleSendMailValidation}
                className="text-sm"
              >
                Xác thực email
              </Button>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="flex-grow">
                <Label htmlFor="phone" className="block text-sm font-medium">
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
  );
}
