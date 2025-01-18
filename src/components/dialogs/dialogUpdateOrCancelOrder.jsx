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

export default function DialogUpdateOrCancelOrder(props) {
  const {
    onOpen,
    onClose,
    onUpdateOrderStatus,
    onCancelOrder,
    selectedOrder,
    actionType,
  } = props;

  const performAction =
    actionType === "update" ? onUpdateOrderStatus : onCancelOrder;
  const actionText = actionType === "update" ? "Cập nhật" : "Đồng ý";
  const title =
    actionType === "update"
      ? "Cập nhật trạng thái đơn hàng"
      : "Xác nhận hủy đơn hàng";
  const description =
    actionType === "update"
      ? `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng ${selectedOrder.id} không?`
      : `Bạn có chắc chắn muốn hủy đơn hàng ${selectedOrder.id} không?`;

  return (
    <Dialog open={onOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[550px] z-[150]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button variant="outline" onClick={performAction}>
            {actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
