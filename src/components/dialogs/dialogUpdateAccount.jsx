import { updateEmail, updatePhone } from "@/api/user/accountRequest";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Dialog.update_account");

  const handleUpdate = async () => {
    if (editField === "email") {
      if (!/^\S+@\S+\.\S+$/.test(tempEmail)) {
        setEmailError(t("email_error"));
        return;
      }
    }

    if (editField === "phone") {
      if (!/^0\d{9}$/.test(tempPhone)) {
        setPhoneError(t("phone_error"));
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
        title: t("toast_success"),
        description:editField === "email" ? t("toast_description_email") : t("toast_description_phone")
      });
      refreshPage();
    } catch (error) {
      toast({
        title: t("toast_error"),
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
            {editField === "email" ? t("title_email") : t("title_phone")}
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
                placeholder={t("input_placeholder_email")}
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
                placeholder={t("input_placeholder_phone")}
              />
              {phoneError && (
                <span className="text-sm text-red-primary">{phoneError}</span>
              )}
            </div>
          )}

          <div className="mt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("button_cancel")}
            </Button>
            <Button type="submit" variant="outline">
              {t("button_save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
