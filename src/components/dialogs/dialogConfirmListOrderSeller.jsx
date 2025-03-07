import { Trash } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatCurrency, formatDate } from "@/utils";
import { ScrollArea } from "../ui/scroll-area";

export default function DialogConfirmListOrderSeller(props) {
  const {
    onOpen,
    onClose,
    onUpdateListOrder,
    onCancelListOrder,
    selectedListOrder,
    onRemoveOrder,
    actionType,
  } = props;

  const performAction =
    actionType === "update" ? onUpdateListOrder : onCancelListOrder;
  const actionText = actionType === "update" ? "Cập nhật" : "Đồng ý";
  const title =
    actionType === "update"
      ? "Cập nhật trạng thái danh sách đơn hàng"
      : "Xác nhận hủy danh sách đơn hàng";
  const description =
    actionType === "update"
      ? `Bạn đã chọn ${selectedListOrder.length} đơn hàng trong danh sách để
            cập nhật trạng thái, vui lòng kiểm tra lại danh sách trước khi cập nhật trạng thái`
      : `Bạn đã chọn ${selectedListOrder.length} đơn hàng trong danh sách để
            hủy, vui lòng kiểm tra lại danh sách trước khi hủy`;

  function getCurrentStatus(status) {
    switch (status) {
      case "ON_HOLD":
        return "Chờ thanh toán";
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "PREPARING":
        return "Chuẩn bị hàng";
      case "WAITING_FOR_SHIPPING":
        return "Chờ giao cho ĐVVC";
      case "PICKED_UP":
        return "Đã giao cho ĐVVC";
      case "OUT_FOR_DELIVERY":
        return "Đang giao hàng";
      case "DELIVERED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
    }
  }

  return (
    <Dialog open={onOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90%] max-w-full mx-auto max-h-[90vh] overflow-y-auto z-[150]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Ngày đặt hàng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedListOrder.map((order) => (
                <TableRow
                  key={order.id}
                  className="h-[65px] hover:cursor-pointer"
                >
                  <TableCell className="font-medium text-center">
                    {order.id}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    <Badge variant="outline">
                      {getCurrentStatus(order.currentStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {formatCurrency(order.total - order.discount)}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {/*Button xóa 1 order */}
                    <Button
                      variant="outline"
                      onClick={() => onRemoveOrder(order.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Hủy bỏ
          </Button>
          <Button
            variant="outline"
            onClick={performAction}
            className="w-full sm:w-auto"
          >
            {actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
