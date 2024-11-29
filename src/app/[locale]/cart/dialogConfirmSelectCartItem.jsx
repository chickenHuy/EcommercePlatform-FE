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

export default function DialogConfirmSelectCartItem(props) {
  const { isOpen, onClose, selectedCartItems, confirmDeleteSelectedCartItem } =
    props;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            {`Bạn có chắc chắn muốn xóa ${selectedCartItems.length} sản phẩm đã chọn khỏi giỏ hàng không?`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={confirmDeleteSelectedCartItem}>Đồng ý</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
