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

export default function DialogUpdateOrCancelOrderSeller(props) {
  const {
    isOpen,
    onClose,
    onUpdateOrderStatus,
    onCancelOrder,
    orderId,
    actionType,
  } = props;
  const performAction =
    actionType === "update" ? onUpdateOrderStatus : onCancelOrder;
  const actionText = actionType === "update" ? "Cập nhật" : "Đồng ý";
  const title =
    actionType === "update" ? "Cập nhật trạng thái đơn hàng" : "Hủy đơn hàng";
  const description =
    actionType === "update"
      ? `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng #${orderId} không ?`
      : `Bạn có chắc chắn muốn hủy đơn hàng #${orderId} không ?`;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={performAction}>{actionText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
