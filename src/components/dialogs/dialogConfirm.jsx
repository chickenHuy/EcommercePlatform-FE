"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function DialogConfirm(props) {
  const { isOpen, onClose, onConfirm, tableName, objectName } = props;
  const t = useTranslations("Dialog.confirm");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description", {
              tableName: tableName,
              objectName: objectName
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            {t("button_cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("button_save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
