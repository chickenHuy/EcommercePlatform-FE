"use client";
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
import {
  getAccount,
  sendMailValidation,
  updateEmail,
  updatePhone,
} from "@/api/user/accountRequest";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [account, setAccount] = useState({
    email: "",
    phone: "",
    username: "",
    emailValidationStatus: "UNVERIFIED",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editField, setEditField] = useState("");
  const { toast } = useToast();

  const formData = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      email: account.email,
      phone: account.phone,
    },
  });

  const fetchAccount = useCallback(async () => {
    try {
      const response = await getAccount();
      setAccount(response.result);
      formData.setValue("email", response.result.email);
      formData.setValue("phone", response.result.phone);
    } catch (error) {
      console.error("fetchAccount thất bại: ", error);
      toast({
        title: "Thất bại",
        description: "Xảy ra lỗi khi lấy thông tin tài khoản",
        variant: "destructive",
      });
    }
  }, [toast, formData]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  const handleOpenDialog = (field) => {
    setEditField(field);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleUpdate = async (data) => {
    const updateFunction = editField === "email" ? updateEmail : updatePhone;
    try {
      await updateFunction({ ...data, userId: account.id });
      toast({
        title: "Thành công",
        description: `${
          editField === "email" ? "Email" : "Số điện thoại"
        } đã được cập nhật`,
      });
      fetchAccount();
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSendMailValidation = async () => {
    try {
      await sendMailValidation();
      toast({
        title: "Thành công",
        description: "Vui lòng kiểm tra email của bạn để xác thực",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Card className="shadow-lg rounded-lg ">
        <CardHeader className="text-center border-b py-6">
          <CardTitle className="text-2xl font-bold">
            Tài khoản của tôi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 mt-4">
          <div className="flex items-center justify-start mb-8">
            <Label className="w-1/5 font-medium mr-2">Tên đăng nhập</Label>
            <span className="flex-grow">
              {account.username || "chưa có tên đăng nhập"}
            </span>
          </div>
          <div className="flex items-center justify-start mb-8">
            <Label className="w-1/5 font-medium mr-2">Email</Label>
            <span className="flex-grow">
              {account.email || "chưa có email"}
            </span>
            {account.emailValidationStatus === "VERIFIED" && (
              <CircleCheck className="mr-4" />
            )}
            <Button onClick={() => handleOpenDialog("email")}>Thay đổi</Button>
          </div>
          {account.emailValidationStatus !== "VERIFIED" && (
            <div className="flex justify-start mb-8">
              <Button onClick={handleSendMailValidation}>Xác thực email</Button>
            </div>
          )}
          <div className="flex items-center justify-start mb-8">
            <Label htmlFor="phone" className="w-1/5 font-medium mr-2">
              Số điện thoại
            </Label>
            <span className=" flex-grow">
              {account.phone || "chưa có số điện thoại"}
            </span>
            <Button onClick={() => handleOpenDialog("phone")}>Thay đổi</Button>
          </div>
        </CardContent>
      </Card>

      {isDialogOpen && (
        <Dialog
          open={isDialogOpen}
          onOpenChange={handleCloseDialog}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>
                Cập nhật {editField === "email" ? "Email" : "Số Điện Thoại"}
              </DialogTitle>
              <DialogDescription>
                Nhập {editField === "email" ? "email" : "số điện thoại"} mới để
                hoàn thành cập nhật
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={formData.handleSubmit(handleUpdate)}>
              <Input
                {...formData.register(editField)}
                type={editField === "email" ? "email" : "text"}
                defaultValue={
                  editField === "email" ? account.email : account.phone
                }
                className="w-full rounded-lg shadow-sm"
              />
              {formData.formState.errors[editField] && (
                <p className="mt-2 text-error col-start-2 col-span-3">
                  {formData.formState.errors[editField].message}
                </p>
              )}
              <div className="mt-4 flex justify-end gap-3">
                <Button type="button" onClick={handleCloseDialog}>
                  Hủy
                </Button>
                <Button type="submit">Lưu thay đổi</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
