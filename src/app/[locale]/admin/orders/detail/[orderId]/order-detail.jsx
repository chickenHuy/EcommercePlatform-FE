import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency, formatDate } from "@/utils";
import { Rating } from "@mui/material";
import {
  ChevronLeft,
  CircleHelpIcon,
  Mail,
  Phone,
  UserRound,
  UserRoundCog,
  Pencil,
  CircleOff
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import StoreEmpty from "@/assets/images/storeEmpty.jpg";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setStore } from "@/store/features/userSearchSlice";
import { useToast } from "@/hooks/use-toast";
import {
  cancelOneOrderByAdmin,
  updateOneOrderByAdmin,
} from "@/api/admin/orderRequest";
import { Toaster } from "@/components/ui/toaster";
import DialogUpdateOrCancelOrder from "@/components/dialogs/dialogUpdateOrCancelOrder";

export default function ViewOrderDetailAdmin({ orderDetail, refreshPage }) {
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

  const dispatch = useDispatch();
  const handleClickViewShop = (storeId) => {
    router.push("/search");
    dispatch(setStore(storeId));
  };

  const handleClickComback = () => {
    router.push("/admin/orders");
  };

  const confirmCancel = async () => {
    if (orderToCancel) {
      try {
        await cancelOneOrderByAdmin(orderToCancel.id);
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
        await updateOneOrderByAdmin(orderToUpdate.id);
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

  function getTransactionStatus(status) {
    switch (status) {
      case "WAITING":
        return "Chờ thanh toán";
      case "SUCCESS":
        return "Đã thanh toán";
    }
  }

  function getPaymentMethod(status) {
    switch (status) {
      case "COD":
        return "COD";
      case "VN_PAY":
        return "VN PAY";
    }
  }

  function renderStatusBadge(currentStatus) {
    const statusMap = {
      DELIVERED: "Đơn hàng được giao thành công",
      CANCELLED: "Đơn hàng đã bị hủy",
    };

    return statusMap[currentStatus] ? (
      <Badge variant="outline" className="truncate text-xl text-red-primary border-l">
        {statusMap[currentStatus]}
      </Badge>
    ) : null;
  }

  return (
    <>
      <div className="min-h-screen mr-10 ml-10">
        <Toaster />
        <div className="flex items-center justify-between space-x-4 pt-4 pb-4">
          <div
            className="flex items-center space-x-2 hover:cursor-pointer"
            onClick={() => handleClickComback()}
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
                <Badge variant="outline" className="truncate">
                  {getTransactionStatus(orderDetail?.currentStatusTransaction)}
                </Badge>
                <Badge variant="outline" className="truncate">
                  {getPaymentMethod(orderDetail?.paymentMethod)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <Separator></Separator>
        <div className="flex items-center justify-center space-x-4 pt-4 pb-4">
          {orderDetail?.currentStatus !== "DELIVERED" &&
            orderDetail?.currentStatus !== "CANCELLED" && (
              <Button
                onClick={() => {
                  handleClickButtonCancel(orderDetail);
                }}
              >
                <CircleOff className="h-6 w-6 mr-2" />
                Hủy đơn hàng
              </Button>
            )}
          {(orderDetail?.currentStatus === "WAITING_FOR_SHIPPING" ||
            orderDetail?.currentStatus === "PICKED_UP" ||
            orderDetail?.currentStatus === "OUT_FOR_DELIVERY") && (
              <Button
                onClick={() => {
                  handleClickButtonUpdate(orderDetail);
                }}
              >
                <Pencil className="h-6 w-6 mr-2" />
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
                <div className="flex items-center space-x-8">
                  <div
                    className="flex items-center gap-4 hover:cursor-pointer"
                    onClick={() => handleClickViewShop(orderDetail?.storeId)}
                  >
                    <Image
                      alt="ảnh shop"
                      src={orderDetail?.avatarStore || StoreEmpty}
                      height={30}
                      width={30}
                      unoptimized={true}
                      className="rounded-full transition-transform duration-300"
                    />
                    <Label className="text-xl hover:cursor-pointer">
                      {orderDetail?.storeName}
                    </Label>
                    <Rating
                      value={Number(orderDetail?.ratingStore)}
                      precision={0.1}
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <CircleHelpIcon className="cursor-default" />
                        </TooltipTrigger>
                        <TooltipContent className="flex flex-col space-y-2">
                          <Label>Cập Nhật Mới Nhất</Label>
                          <Label>
                            {formatDate(orderDetail?.lastUpdatedAt)}
                          </Label>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
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
                            className="rounded-md transition-transform duration-300 hover:scale-125 hover:cursor-pointer"
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
                            <Label className="text-sm">
                              {item.productNameBrand}
                            </Label>
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
                    <Label className="text-left">Phí Vận chuyển</Label>
                    <Label className="text-right">
                      {`${formatCurrency(orderDetail?.shippingFee)}`}
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 items-center">
                    <Label className="text-left">Shop giảm giá</Label>
                    <Label className="text-right">
                      {`- ${formatCurrency(orderDetail?.discount)}`}
                    </Label>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <Label className="text-left">Giảm giá vận chuyển</Label>
                    <Label className="text-center">
                      {`${(orderDetail?.shippingDiscount /
                        orderDetail?.shippingFee) *
                        100
                        } %`}
                    </Label>
                    <Label className="text-right">
                      {`- ${formatCurrency(orderDetail?.shippingDiscount)}`}
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 items-center">
                    <Label className="text-left">Tổng thanh toán</Label>
                    <Label className="text-right font-bold">
                      {formatCurrency(orderDetail?.grandTotal)}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-1/4 flex flex-col space-y-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Địa chỉ lấy hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 flex flex-col">
                <div className="flex items-center space-x-2">
                  <UserRound />
                  <Label>{orderDetail?.storeAccountName}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone />
                  <Label>
                    {orderDetail?.storePhone ||
                      "(người bán chưa có số điện thoại)"}
                  </Label>
                </div>
                <div>
                  {orderDetail?.storeDetailLocate ? (
                    <Label>{`${orderDetail?.storeDetailLocate}, `}</Label>
                  ) : (
                    ""
                  )}
                  <Label>
                    {orderDetail?.storeDetailAddress
                      ? `${orderDetail?.storeDetailAddress}`
                      : "số nhà tên đường, "}
                  </Label>
                </div>
                <Label>
                  {orderDetail?.storeSubDistrict
                    ? orderDetail?.storeSubDistrict
                    : "xã/phường, "}
                </Label>
                <Label>
                  {orderDetail?.storeDistrict
                    ? orderDetail?.storeDistrict
                    : "quận/huyện, "}
                </Label>
                <Label>
                  {orderDetail?.storeProvince
                    ? orderDetail?.storeProvince
                    : "tỉnh/thành phố"}
                </Label>
              </CardContent>
            </Card>
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
                <CardTitle className="text-2xl font-bold">
                  Địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 flex flex-col">
                <div className="flex items-center space-x-2">
                  <UserRound />
                  <Label>{orderDetail?.recipientName}</Label>
                </div>
                {orderDetail?.orderPhone ? (
                  <div className="flex items-center space-x-2">
                    <Phone />
                    <Label>{orderDetail?.orderPhone}</Label>
                  </div>
                ) : (
                  ""
                )}
                <div>
                  {orderDetail?.detailLocate ? (
                    <Label>{`${orderDetail?.detailLocate}, `}</Label>
                  ) : (
                    ""
                  )}
                  <Label>{`${orderDetail?.detailAddress}`}</Label>
                </div>
                <Label>{orderDetail?.subDistrict}</Label>
                <Label>{orderDetail?.district}</Label>
                <Label>{orderDetail?.province}</Label>
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
