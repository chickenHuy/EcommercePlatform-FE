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

  const performAction = actionType === "deleteOne" ? onDeleteOne : onDeleteList;
  const title =
    actionType === "deleteOne"
      ? "Xác nhận xóa sản phẩm"
      : "Xác nhận xóa danh sách sản phẩm";
  const description =
    actionType === "deleteOne"
      ? `Bạn có chắc chắn muốn xóa sản phẩm ${cartItemToDelete.name} khỏi giỏ hàng không?`
      : `Bạn có chắc chắn muốn xóa ${selectedListCartItem.length} sản phẩm đã chọn khỏi giỏ hàng không?`;

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
            Đồng ý
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
