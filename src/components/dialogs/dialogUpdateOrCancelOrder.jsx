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
import { Label } from "../ui/label";
import { MoveRight } from "lucide-react";

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
      ? t("text_action_type_update", { orderId: selectedOrder.id })
      : t("text_action_type_cancel", { orderId: selectedOrder.id });

  function getCurrentStatus(status) {
    switch (status) {
      case "PENDING":
        return t("waiting_for_confirmation");
      case "CONFIRMED":
        return t("confirmed");
      case "PREPARING":
        return t("preparing");
      case "WAITING_FOR_SHIPPING":
        return t("waiting_for_shipping");
      case "PICKED_UP":
        return t("delivered_to_the_carrier");
      case "OUT_FOR_DELIVERY":
        return t("on_delivery");
      case "DELIVERED":
        return t("completed");
    }
  }

  function getNextStatus(status) {
    switch (status) {
      case "PENDING":
        return t("confirmed");
      case "CONFIRMED":
        return t("preparing");
      case "PREPARING":
        return t("waiting_for_shipping");
      case "WAITING_FOR_SHIPPING":
        return t("delivered_to_the_carrier");
      case "PICKED_UP":
        return t("on_delivery");
      case "OUT_FOR_DELIVERY":
        return t("completed");
    }
  }

  return (
    <Dialog open={onOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[550px] z-[150]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {actionType === "update" &&
            (<div className="flex items-center justify-center gap-8 py-4">
              <Label className="text-xl font-bold">{getCurrentStatus(selectedOrder.currentStatus).toUpperCase()}</Label>
              <MoveRight />
              <Label className="text-xl font-bold">{getNextStatus(selectedOrder.currentStatus).toUpperCase()}</Label>
            </div>
            )}
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
