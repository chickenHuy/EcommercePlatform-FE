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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Dialog.confirm_list_order_seller");

  const performAction =
    actionType === "update" ? onUpdateListOrder : onCancelListOrder;
  const actionText = actionType === "update" ? t("text_update") : t("text_ok");
  const title =
    actionType === "update"
      ? t("text_update_list_status_order")
      : t("text_cancel_list_order");
  const description =
    actionType === "update"
      ? t("text_action_type_update", {orderListLength: selectedListOrder.length})
      : t("text_action_type_cancel", {orderListLength: selectedListOrder.length});

  function getCurrentStatus(status) {
    switch (status) {
      case "ON_HOLD":
        return t("waiting_for_payment");
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
      case "CANCELLED":
        return t("cancelled");
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
                <TableHead>{t("text_order_code")}</TableHead>
                <TableHead>{t("text_order_date")}</TableHead>
                <TableHead>{t("text_status")}</TableHead>
                <TableHead>{t("text_total_amount")}</TableHead>
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
            {t("text_cancel")}
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
