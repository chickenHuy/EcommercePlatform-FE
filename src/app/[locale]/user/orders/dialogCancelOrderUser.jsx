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

export default function DialogCancelOrderUser(props) {
  const {
    isOpen,
    onClose,
    onUpdateOrderStatus,
    onCancelOrder,
    orderId,
    actionType,
  } = props;
  const performAction =
    actionType === "cancel" ? onCancelOrder : onUpdateOrderStatus;
  const actionText = actionType === "cancel" ? "Đồng ý" : "Cập nhật";
  const title =
    actionType === "cancel" ? "Hủy đơn hàng" : "Cập nhật trạng thái đơn hàng";
  const description =
    actionType === "cancel"
      ? `Bạn có chắc chắn muốn hủy đơn hàng #${orderId} không ?`
      : `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng #${orderId} không ?`;
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
