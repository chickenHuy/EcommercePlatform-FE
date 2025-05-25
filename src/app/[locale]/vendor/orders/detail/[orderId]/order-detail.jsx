import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { formatCurrency } from "@/utils";
import {
  ChevronLeft,
  CircleOff,
  Mail,
  Pencil,
  Phone,
  UserRoundCog,
} from "lucide-react";
import Image from "next/image";
import DialogUpdateOrCancelOrder from "@/components/dialogs/dialogUpdateOrCancelOrder";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  cancelOneOrderBySeller,
  updateOneOrderBySeller,
} from "@/api/vendor/orderRequest";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function ViewOrderDetailSeller({ orderDetail, refreshPage }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState("");
  const { toast } = useToast();
  const t = useTranslations("Vendor.order");
  const router = useRouter();

  const handleClickButtonCancel = (orderDetail) => {
    setIsDialogOpen(true);
    setOrderToCancel(orderDetail);
    setSelectedOrder(orderDetail);
    setActionType("cancel");
  };

  const handleClickButtonUpdate = (orderDetail) => {
    setIsDialogOpen(true);
    setOrderToUpdate(orderDetail);
    setSelectedOrder(orderDetail);
    setActionType("update");
  };

  const handleClickComback = () => {
    router.push("/vendor/orders");
  };

  const confirmCancel = async () => {
    if (orderToCancel) {
      try {
        await cancelOneOrderBySeller(orderToCancel.id);
        toast({
          description: t("cancelled_notify", { orderId: orderToCancel.id }),
        });
        refreshPage();
        setIsDialogOpen(false);
      } catch (error) {
        toast({
          title: t("notify"),
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const confirmUpdate = async () => {
    if (orderToUpdate) {
      try {
        await updateOneOrderBySeller(orderToUpdate.id);
        toast({
          description: t("updated_notify", { orderId: orderToUpdate.id }),
        });
        refreshPage();
        setIsDialogOpen(false);
      } catch (error) {
        toast({
          title: t("notify"),
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

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

  function renderStatusBadge(currentStatus) {
    const statusMap = {
      DELIVERED: t("order_delivered_successfully"),
      CANCELLED: t("order_has_been_cancelled"),
      WAITING_FOR_SHIPPING: t("waiting_for_shipping_pickup"),
      PICKED_UP: t("shipping_unit_successfully_picked_up"),
      OUT_FOR_DELIVERY: t("order_is_being_delivered_to_customer"),
    };

    return statusMap[currentStatus] ? (
      <span className="whitespace-nowrap text-[1em] text-red-primary shadow-md px-3 py-1 rounded-md">
        {statusMap[currentStatus]}
      </span>
    ) : null;
  }

  return (
    <>
      <Toaster />

      <div className="w-full h-fit flex flex-col justify-center items-center py-20">
        <div className="w-[98%]">
          <div className="flex lg:items-center items-start justify-between py-3 gap-3">
            <div
              className="cursor-pointer hover:bg-white-secondary rounded-sm hover:shadow-md"
              onClick={() => handleClickComback()}
            >
              <ChevronLeft />
            </div>
            <div className="flex lg:flex-row flex-col lg:items-center items-end gap-2">
              <span className="lg:w-full w-[300px] truncate text-[1em]">
                {t("ORDER_CODE", { orderCode: orderDetail?.id })}
              </span>
              <div className="w-[1px] h-5 bg-black-primary lg:block hidden"></div>
              <span className="whitespace-nowrap text-[1em] text-red-primary shadow-md px-3 py-1 rounded-md">
                {getCurrentStatus(orderDetail?.currentStatus)}
              </span>
            </div>
          </div>
          <Separator></Separator>
          <div className="w-full h-fit flex items-center justify-end gap-3 py-5">
            {(orderDetail?.currentStatus === "ON_HOLD" ||
              orderDetail?.currentStatus === "PENDING" ||
              orderDetail?.currentStatus === "CONFIRMED" ||
              orderDetail?.currentStatus === "PREPARING") && (
              <Button
                onClick={() => {
                  handleClickButtonCancel(orderDetail);
                }}
              >
                <CircleOff className="h-5 w-5 mr-3" />
                {t("cancel_order")}
              </Button>
            )}
            {(orderDetail?.currentStatus === "PENDING" ||
              orderDetail?.currentStatus === "CONFIRMED" ||
              orderDetail?.currentStatus === "PREPARING") && (
              <Button
                onClick={() => {
                  handleClickButtonUpdate(orderDetail);
                }}
              >
                <Pencil className="h-5 w-5 mr-3" />
                {t("update_status")}
              </Button>
            )}
            {renderStatusBadge(orderDetail?.currentStatus)}
          </div>

          <div className="w-full h-fit flex flex-col justify-between gap-5">
            <div className="w-full h-fit flex flex-col lg:flex-row gap-5">
              <Card className="rounded-lg w-full">
                <CardHeader className="py-3">
                  <CardTitle className="text-[1.3em]">
                    {t("customer_information")}
                  </CardTitle>
                </CardHeader>
                <Separator></Separator>
                <CardContent className="flex flex-col gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <UserRoundCog />
                    <span className="text-[1em]">
                      {orderDetail?.userAccountName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail />
                    <span className="text-[1em]">
                      {orderDetail?.userEmail || "[Chưa có email]"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone />
                    <span className="text-[1em]">
                      {orderDetail?.userPhone || "[Chưa có số điện thoại]"}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-lg w-full">
                <CardHeader className="py-3">
                  <CardTitle className="text-[1.3em]">{t("note")}</CardTitle>
                </CardHeader>
                <Separator></Separator>
                <CardContent className="py-3">
                  <span className="whitespace-wrap">
                    {orderDetail?.note ? orderDetail.note : t("no_note")}
                  </span>
                </CardContent>
              </Card>
            </div>
            <div className="w-full h-fit flex flex-col gap-5">
              <Card className="rounded-lg w-full">
                <CardHeader className="py-3">
                  <CardTitle className="text-[1.3em]">
                    {t("product_list")}
                  </CardTitle>
                </CardHeader>
                <Separator></Separator>
                <CardContent className="p-3 space-y-3">
                  {orderDetail?.orderItems &&
                    orderDetail.orderItems.map((item) => (
                      <Link
                        key={item.id}
                        href={`/${item.productSlug}`}
                        className="w-full flex flex-col items-start lg:flex-row lg:items-center justify-between p-3 cursor-pointer border shadow-sm rounded-md"
                      >
                        <div className="w-full flex items-center gap-2">
                          <Image
                            alt={item.productName}
                            src={item.productMainImageUrl || ProductNotFound}
                            height={100}
                            width={100}
                            className="rounded-md border w-20 h-20 object-cover"
                          />
                          <div className="flex flex-col justify-start items-start">
                            <span
                              className="text-[em]"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/${item.productSlug}`);
                              }}
                            >
                              {item.productName}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {item.productNameBrand}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {item.values ? item.values.join(" | ") : ""}
                            </span>
                          </div>
                        </div>
                        <div className="w-full flex flex-col items-end text-right">
                          <div className="flex items-center space-x-1">
                            <span className="text-[1.2em] font-bold">
                              {item.quantity}
                            </span>
                            <span>x {formatCurrency(item.price)}</span>
                          </div>
                          <span className="text-[1.2em] text-red-primary font-bold">
                            {formatCurrency(item.quantity * item.price)}
                          </span>
                        </div>
                      </Link>
                    ))}
                </CardContent>
              </Card>
              <Card className="rounded-lg">
                <CardHeader className="py-3">
                  <CardTitle className="text-[1.3em]">
                    {t("order_summary")}
                  </CardTitle>
                </CardHeader>
                <Separator></Separator>
                <CardContent className="py-5">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-row justify-between items-center">
                      <span className="text-[1em]">
                        {t("total_item", {
                          total: orderDetail?.orderItems.length,
                        })}
                      </span>
                      <span className="text-[1em]">
                        {formatCurrency(orderDetail?.total)}
                      </span>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                      <span className="text-[1em]">{t("shop_discount")}</span>
                      <span className="text-[1em]">
                        {`- ${formatCurrency(orderDetail?.discount)}`}
                      </span>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                      <span className="text-[1em]">{t("total_payment")}</span>
                      <span className="text-[1.2em] text-red-primary">
                        {formatCurrency(
                          orderDetail?.total - orderDetail?.discount,
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {isDialogOpen && (
        <>
          <div className="fixed inset-0 bg-black-primary bg-opacity-85 z-[150]" />
          <DialogUpdateOrCancelOrder
            onOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onUpdateOrderStatus={confirmUpdate}
            onCancelOrder={confirmCancel}
            selectedOrder={selectedOrder}
            actionType={actionType}
          />
        </>
      )}
    </>
  );
}
