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

export default function DialogConfirmDeleteCartItem(props) {
  const {
    isOpen,
    onClose,
    cartItem,
    confirmDeleteCartItem,
  } = props;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa sản phẩm <strong>{cartItem.name}</strong>{" "}
            này khỏi giỏ hàng không?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={confirmDeleteCartItem}>Đồng ý</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
