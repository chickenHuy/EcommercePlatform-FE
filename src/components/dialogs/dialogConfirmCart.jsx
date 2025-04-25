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

export default function DialogConfirmCart(props) {
  const {
    onOpen,
    onClose,
    onDeleteOne,
    onDeleteList,
    cartItemToDelete,
    selectedListCartItem,
    actionType,
  } = props;
  const t = useTranslations("Dialog.confirm_cart");

  const performAction = actionType === "deleteOne" ? onDeleteOne : onDeleteList;
  const title =
    actionType === "deleteOne"
      ? t("title_one")
      : t("title_list");
  const description =
    actionType === "deleteOne"
      ? t("description_one", {productName: cartItemToDelete.name})
      : t("description_list", {productLength: selectedListCartItem.length});

  return (
    <Dialog open={onOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[550px] z-[150]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            {t("button_cancel")}
          </Button>
          <Button variant="outline" onClick={performAction}>
            {t("button_save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
