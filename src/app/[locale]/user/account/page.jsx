"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { CircleCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAccount, sendMailValidation } from "@/api/user/accountRequest";
import DialogUpdateAccount from "@/components/dialogs/dialogUpdateAccount";
import Loading from "@/components/loading";
import { useTranslations } from "next-intl";

export default function AccountUser() {
  const [user, setUser] = useState({
    email: "",
    phone: "",
    username: "",
    emailValidationStatus: "",
    id: null,
  });
  const [dialog, setDialog] = useState({ open: false, field: "" });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const t = useTranslations("User.account");

  const fetchAccount = useCallback(async () => {
    try {
      const { result } = await getAccount();
      setUser({
        email: result.email,
        phone: result.phone,
        username: result.username,
        emailValidationStatus: result.emailValidationStatus,
        id: result.id,
      });
    } catch (error) {
      toast({
        title: t('toast.failed'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  const handleSendMailValidation = async () => {
    try {
      await sendMailValidation();
      toast({
        description: t('verification_sent'),
      });
    } catch (error) {
      toast({
        title: t('failed'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOpenDialog = (field) => setDialog({ open: true, field });
  const handleCloseDialog = () => setDialog({ open: false, field: "" });

  return (
    <>
      {loading && <div className="w-full h-fit lg:pl-[300px] relative">
        <Loading />
      </div>}

      {!loading && (
        <div className="w-full h-fit lg:pl-[300px] flex justify-center items-center">
          <Card className="min-w-[350px] w-[95%] shadow-xl rounded-xl">
            <CardHeader className="text-center border-b">
              <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center py-8 space-y-8">
              <div className="w-full flex flex-col items-start justify-between gap-2">
                <span className="text-[1em]">{t('username')}</span>
                <Input className="text-[1em]" disabled readOnly value={user.username || t('no_username')} />
              </div>

              <div className="w-full flex flex-col items-start justify-between gap-2">
                <span className="text-[1em]">{t('email')}</span>
                <div className="w-full flex flex-row items-start justify-between gap-3">
                  <Input value={user.email || t('no_email')} disabled readOnly />
                  {user.emailValidationStatus === "VERIFIED" && <CircleCheck />}
                  <Button onClick={() => handleOpenDialog("email")}>
                    {t('change')}
                  </Button>
                </div>
                {user.emailValidationStatus !== "VERIFIED" && (
                  <div className="w-full flex items-center justify-start">
                    <Button onClick={handleSendMailValidation}>
                      {t('verify_email')}
                    </Button>
                  </div>
                )}
              </div>


              <div className="w-full flex flex-col items-start justify-between gap-2">
                <span className="text-[1em]">{t('phone')}</span>
                <div className="w-full flex flex-row items-center justify-between gap-3">
                  <Input className="text-[1em]" value={user.phone || t('no_phone')} disabled readOnly />
                  <Button onClick={() => handleOpenDialog("phone")}>
                    {t('change')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {dialog.open && (
        <>
          <div className="fixed inset-0 bg-black-primary bg-opacity-85 z-[200]" />
          <DialogUpdateAccount
            onOpen={dialog.open}
            onClose={handleCloseDialog}
            editField={dialog.field}
            email={user.email}
            phone={user.phone}
            userId={user.id}
            refreshPage={fetchAccount}
            toast={toast}
          />
        </>
      )}
    </>
  );
}
