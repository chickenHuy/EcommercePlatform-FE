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

export default function DialogUpdateOrCancelOrder(props) {
  const {
    onOpen,
    onClose,
    onUpdateOrderStatus,
    onCancelOrder,
    selectedOrder,
    actionType,
  } = props;
  const t = useTranslations("Dialog.update_cancel_order");

  const performAction =
    actionType === "update" ? onUpdateOrderStatus : onCancelOrder;
  const actionText = actionType === "update" ? t("text_update") : t("text_ok");
  const title =
    actionType === "update"
      ? t("text_update_status_order")
      : t("text_cancel_order");
  const description =
    actionType === "update"
      ? t("text_action_type_update", {orderId: selectedOrder.id})
      : t("text_action_type_cancel", {orderId: selectedOrder.id});

  return (
    <Dialog open={onOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[550px] z-[150]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            {t("text_cancel")}
          </Button>
          <Button variant="outline" onClick={performAction}>
            {actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
