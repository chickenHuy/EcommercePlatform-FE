"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useState } from "react";
import { CircleCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAccount, sendMailValidation } from "@/api/user/accountRequest";
import { CircularProgress } from "@mui/material";
import DialogUpdateAccount from "@/components/dialogs/dialogUpdateAccount";

export default function AccountUser() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [emailValidationStatus, setEmailValidationStatus] = useState("");
  const [userId, setUserId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editField, setEditField] = useState("");
  const [loadPage, setLoadPage] = useState(true);
  const { toast } = useToast();

  const fetchAccount = useCallback(async () => {
    try {
      const response = await getAccount();
      setEmail(response.result.email);
      setPhone(response.result.phone);
      setEmailValidationStatus(response.result.emailValidationStatus);
      setUsername(response.result.username);
      setUserId(response.result.id);
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadPage(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  const handleOpenDialog = (field) => {
    setEditField(field);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditField("");
    setOpenDialog(false);
  };

  const handleSendMailValidation = async () => {
    try {
      await sendMailValidation();
      toast({
        description: "Vui lòng kiểm tra email của bạn để xác thực",
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
      {loadPage && (
        <div className="fixed inset-0 flex flex-col justify-center items-center z-[500] space-y-4 bg-black-primary">
          <CircularProgress />
          <Label className="text-2xl text-white-primary">
            Đang tải dữ liệu...
          </Label>
        </div>
      )}

      {!loadPage && (
        <div className="flex justify-center items-center">
          <Card className="w-full min-w-[600px] max-w-[1200px] shadow-xl rounded-xl">
            <CardHeader className="text-center border-b">
              <CardTitle className="text-2xl font-bold">
                Tài khoản của tôi
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center py-8 space-y-8">
              <div className="w-full flex items-center min-h-8">
                <Label className="w-[180px] text-sm">Tên đăng nhập</Label>
                <Label className="text-sm">
                  {username || "chưa có tên đăng nhập"}
                </Label>
              </div>

              <div className="w-full flex items-center min-h-8 gap-4">
                <Label className="w-[200px] text-sm">Email</Label>
                <Input
                  value={email || "bạn chưa có email"}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  disabled={true}
                />
                {emailValidationStatus === "VERIFIED" && <CircleCheck />}
                <Button
                  variant="outline"
                  onClick={() => handleOpenDialog("email")}
                >
                  Thay đổi
                </Button>
              </div>

              {emailValidationStatus !== "VERIFIED" && (
                <div className="w-full flex items-center justify-start">
                  <Button variant="outline" onClick={handleSendMailValidation}>
                    Xác thực email
                  </Button>
                </div>
              )}

              <div className="w-full flex items-center min-h-8 gap-4">
                <Label className="w-[200px] text-sm">Số điện thoại</Label>
                <Input
                  value={phone || "bạn chưa có số điện thoại"}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={true}
                />
                <Button
                  variant="outline"
                  onClick={() => handleOpenDialog("phone")}
                >
                  Thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {openDialog && (
        <>
          <div className="fixed inset-0 bg-black-primary bg-opacity-85 z-[200]" />
          <DialogUpdateAccount
            onOpen={openDialog}
            onClose={handleCloseDialog}
            editField={editField}
            email={email}
            phone={phone}
            userId={userId}
            refreshPage={fetchAccount}
            toast={toast}
          />
        </>
      )}
    </>
  );
}
