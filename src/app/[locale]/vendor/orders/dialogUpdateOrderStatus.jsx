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

export default function DialogUpdateOrderStatus(props) {
  const { isOpen, onClose, onUpdateOrderStatus, orderCode } = props;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng{" "}
            <strong>{orderCode}</strong> không?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={onUpdateOrderStatus}>Cập nhật</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
