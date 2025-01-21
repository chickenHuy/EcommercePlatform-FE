import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { formatCurrency, formatDate } from "@/utils/commonUtils";
import { ChevronLeft, Mail, Phone, UserRoundCog } from "lucide-react";
import Image from "next/image";
import StoreEmpty from "@/assets/images/storeEmpty.jpg";
import DialogUpdateOrCancelOrder from "@/components/dialogs/dialogUpdateOrCancelOrder";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  cancelOneOrderBySeller,
  updateOneOrderBySeller,
} from "@/api/vendor/orderRequest";
import { EditCalendar, EventBusy } from "@mui/icons-material";

export default function ViewOrderDetailSeller({ orderDetail, refreshPage }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState("");
  const { toast } = useToast();

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

  const router = useRouter();
  const handleOnClickViewProductDetail = (slug) => {
    router.push(`/${slug}`);
  };

  const handleOnClickComback = () => {
    router.push("/vendor/orders");
  };

  const confirmCancel = async () => {
    if (orderToCancel) {
      try {
        await cancelOneOrderBySeller(orderToCancel.id);
        toast({
          description: `Đơn hàng "${orderToCancel.id}" đã được hủy thành công`,
        });
        refreshPage();
        setIsDialogOpen(false);
      } catch (error) {
        toast({
          title: "Thất bại",
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
          description: `Đơn hàng "${orderToUpdate.id}" đã được cập nhật trạng thái`,
        });
        refreshPage();
        setIsDialogOpen(false);
      } catch (error) {
        toast({
          title: "Thất bại",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

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

  function renderStatusBadge(currentStatus) {
    const statusMap = {
      DELIVERED: "Đơn hàng được giao thành công",
      CANCELLED: "Đơn hàng đã bị hủy",
      WAITING_FOR_SHIPPING: "Đang chờ đơn vị vận chuyển lấy hàng",
      PICKED_UP: "Đơn vị vận chuyển lấy hàng thành công",
      OUT_FOR_DELIVERY: "Đơn hàng đang giao đến khách hàng",
    };

    return statusMap[currentStatus] ? (
      <Badge variant="outline" className="truncate text-xl">
        {statusMap[currentStatus]}
      </Badge>
    ) : null;
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen ml-8 mr-8 mt-16">
        <div className="flex items-center justify-between space-x-4 pt-4 pb-4">
          <div
            className="flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => handleOnClickComback()}
          >
            <ChevronLeft className="h-7 w-7" />
            <Label className="truncate text-xl hover:cursor-pointer">
              Trở lại
            </Label>
          </div>
          <div className="flex-col space-y-2">
            <Label className="truncate text-2xl font-bold">
              Mã đơn hàng: {orderDetail?.id}
            </Label>
            <div className="flex items-center space-x-2">
              <Label className="text-sm">
                Ngày đặt hàng: {formatDate(orderDetail?.createdAt)}
              </Label>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="truncate">
                  {getCurrentStatus(orderDetail?.currentStatus)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <Separator></Separator>
        <div className="flex items-center justify-center space-x-4 pt-4 pb-4">
          {(orderDetail?.currentStatus === "ON_HOLD" ||
            orderDetail?.currentStatus === "PENDING" ||
            orderDetail?.currentStatus === "CONFIRMED" ||
            orderDetail?.currentStatus === "PREPARING") && (
            <Button
              variant="outline"
              onClick={() => {
                handleClickButtonCancel(orderDetail);
              }}
            >
              <EventBusy className="h-6 w-6 mr-2" />
              Hủy đơn hàng
            </Button>
          )}
          {(orderDetail?.currentStatus === "PENDING" ||
            orderDetail?.currentStatus === "CONFIRMED" ||
            orderDetail?.currentStatus === "PREPARING") && (
            <Button
              variant="outline"
              onClick={() => {
                handleClickButtonUpdate(orderDetail);
              }}
            >
              <EditCalendar className="h-6 w-6 mr-2" />
              Cập nhật trạng thái
            </Button>
          )}
          {renderStatusBadge(orderDetail?.currentStatus)}
        </div>
        <Separator></Separator>
        <div className="w-full flex justify-between space-x-8 mt-8">
          <div className="w-3/4 flex flex-col space-y-8 mb-8">
            <Card className="space-y-8 p-8">
              <CardTitle className="flex justify-between items-center">
                <Label className="text-2xl font-bold">Sản phẩm</Label>
              </CardTitle>
              {orderDetail?.orderItems &&
                orderDetail.orderItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent>
                      <div className="flex items-center justify-between mt-6">
                        <div className="w-4/5 flex items-center space-x-4">
                          <Image
                            alt={item.productName}
                            src={item.productMainImageUrl || StoreEmpty}
                            height={100}
                            width={100}
                            className="rounded-md transition-transform duration-300 hover:scale-125 hover:cursor-pointer hover:mr-2"
                            onClick={() =>
                              handleOnClickViewProductDetail(item.productSlug)
                            }
                          />
                          <div className="flex flex-col space-y-2">
                            <Label
                              className="text-xl font-bold hover:text-2xl hover:cursor-pointer"
                              onClick={() =>
                                handleOnClickViewProductDetail(item.productSlug)
                              }
                            >
                              {item.productName}
                            </Label>
                            <Label>{item.productNameBrand}</Label>
                            <Label className="text-sm text-muted-foreground">
                              {item.values ? item.values.join(" | ") : ""}
                            </Label>
                          </div>
                        </div>
                        <div className="w-1/5 flex flex-col items-end text-right">
                          <div className="flex items-center space-x-1">
                            <Label className="text-2xl font-bold">
                              {item.quantity}
                            </Label>
                            <Label>x {formatCurrency(item.price)}</Label>
                          </div>
                          <Label>
                            {formatCurrency(item.quantity * item.price)}
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 items-center">
                    <Label className="text-left">Tổng cộng</Label>
                    <Label className="text-center">
                      {`${orderDetail?.orderItems.length} item(s)`}
                    </Label>
                    <Label className="text-right">
                      {formatCurrency(orderDetail?.total)}
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 items-center">
                    <Label className="text-left">Shop giảm giá</Label>
                    <Label className="text-right">
                      {`- ${formatCurrency(orderDetail?.discount)}`}
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 items-center">
                    <Label className="text-left">Tổng thanh toán</Label>
                    <Label className="text-right font-bold">
                      {formatCurrency(
                        orderDetail?.total - orderDetail?.discount
                      )}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-1/4 flex flex-col space-y-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Khách hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <UserRoundCog />
                  <Label>{orderDetail?.userAccountName}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail />
                  <Label>{orderDetail?.userEmail || "(chưa có email)"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone />
                  <Label>
                    {orderDetail?.userPhone || "(chưa có số điện thoại)"}
                  </Label>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Ghi chú</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label>
                  {orderDetail?.note ? orderDetail.note : "(không có ghi chú)"}
                </Label>
              </CardContent>
            </Card>
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
