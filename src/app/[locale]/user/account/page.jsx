"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useState } from "react";
import { CircleCheck } from "lucide-react";
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
  DialogTitle,
} from "@/components/ui/dialog";

export default function ManageAccount() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [emailValidationStatus, setEmailValidationStatus] = useState("");
  const [userId, setUserId] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editField, setEditField] = useState("");
  const { toast } = useToast();

  const fetchAccount = useCallback(async () => {
    try {
      const response = await getAccount();
      console.log("Account: ", response.result);
      setEmail(response.result.email);
      setPhone(response.result.phone);
      setEmailValidationStatus(response.result.emailValidationStatus);
      setUsername(response.result.username);
      setUserId(response.result.id);
    } catch (error) {
      console.error("fetchAccount thất bại: ", error);
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  const handleOpenDialog = (field) => {
    setEditField(field);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = (field) => {
    setEditField(field);
    setIsDialogOpen(false);
  };

  const handleUpdate = async () => {
    setEmailError("");
    setPhoneError("");

    if (editField === "email") {
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        setEmailError("Email không hợp lệ");
        return;
      }
    }

    if (editField === "phone") {
      if (!/^0\d{9}$/.test(phone)) {
        setPhoneError("Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0");
        return;
      }
    }

    const updateFunction = editField === "email" ? updateEmail : updatePhone;
    const data = editField === "email" ? { email } : { phone };

    try {
      await updateFunction({ ...data, userId });
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
    <>
      <Card className="shadow-lg rounded-lg ">
        <CardHeader className="text-center border-b py-6">
          <CardTitle className="text-2xl font-bold">
            Tài khoản của tôi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 mt-4">
          <div className="flex items-center justify-start min-h-8 mb-8">
            <Label className="w-1/5">Tên đăng nhập</Label>
            <Label>{username || "chưa có tên đăng nhập"}</Label>
          </div>
          <div className="flex items-center justify-start min-h-8 mb-8">
            <Label className="w-1/5 mr-8">Email</Label>
            <Input
              value={email || "bạn chưa có email"}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              disabled={true}
              className="flex-grow mr-4 border-none"
            ></Input>
            {emailValidationStatus === "VERIFIED" && (
              <CircleCheck className="mr-4" />
            )}
            <Button onClick={() => handleOpenDialog("email")}>Thay đổi</Button>
          </div>
          {emailValidationStatus !== "VERIFIED" && (
            <div className="flex justify-start mb-8">
              <Button onClick={handleSendMailValidation}>Xác thực email</Button>
            </div>
          )}
          <div className="flex items-center justify-start min-h-8 mb-8">
            <Label className="w-1/5 mr-8">Số điện thoại</Label>
            <Input
              value={phone || "bạn chưa có số điện thoại"}
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              disabled={true}
              className="flex-grow mr-4 border-none"
            ></Input>
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              {editField === "email" ? (
                <>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="nhập email mới"
                    className="w-full rounded-lg shadow-sm"
                  />
                  {emailError && (
                    <p className="mt-2 text-sm text-error col-start-2 col-span-3">
                      {emailError}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="text"
                    placeholder="nhập số điện thoại mới"
                    className="w-full rounded-lg shadow-sm"
                  />
                  {phoneError && (
                    <p className="mt-2 text-sm text-error col-start-2 col-span-3">
                      {phoneError}
                    </p>
                  )}
                </>
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
    </>
  );
}
