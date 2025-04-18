import { updateEmail, updatePhone } from "@/api/user/accountRequest";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function DialogUpdateAccount(props) {
  const {
    onOpen,
    onClose,
    editField,
    email,
    phone,
    userId,
    refreshPage,
    toast,
  } = props;

  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhone, setTempPhone] = useState(phone);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleUpdate = async () => {
    if (editField === "email") {
      if (!/^\S+@\S+\.\S+$/.test(tempEmail)) {
        setEmailError("Email không hợp lệ");
        return;
      }
    }

    if (editField === "phone") {
      if (!/^0\d{9}$/.test(tempPhone)) {
        setPhoneError("Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0");
        return;
      }
    }

    const updateFunction = editField === "email" ? updateEmail : updatePhone;
    const data =
      editField === "email" ? { email: tempEmail } : { phone: tempPhone };

    try {
      onClose();
      await updateFunction({ ...data, userId });
      toast({
        title: "Thành công",
        description: `${
          editField === "email" ? "Email" : "Số điện thoại"
        } đã được cập nhật`,
      });
      refreshPage();
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={onOpen} onOpenChange={onClose}>
      <DialogContent className="z-[200] max-w-[550px] flex flex-col gap-8">
        <DialogHeader>
          <DialogTitle>
            Cập nhật {editField === "email" ? "Email" : "Số Điện Thoại"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          className="flex flex-col gap-8"
        >
          {editField === "email" && (
            <div className="flex flex-col gap-4">
              <Input
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                placeholder="Nhập email mới @gmail.com"
              />
              {emailError && (
                <span className="text-sm text-red-primary">{emailError}</span>
              )}
            </div>
          )}

          {editField === "phone" && (
            <div className="flex flex-col gap-4">
              <Input
                value={tempPhone}
                onChange={(e) => setTempPhone(e.target.value)}
                placeholder="Nhập số điện thoại mới"
              />
              {phoneError && (
                <span className="text-sm text-red-primary">{phoneError}</span>
              )}
            </div>
          )}

          <div className="mt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button type="submit" variant="outline">
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
