"use client";

import {
  cancelOrderByAdmin,
  getOneOrderByAdmin,
  updateOrderStatusByAdmin,
} from "@/api/admin/orderRequest";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  CircleHelpIcon,
  Mail,
  Pencil,
  Phone,
  UserRound,
  UserRoundCog,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import DialogUpdateOrCancelOrderAdmin from "./dialogUpdateOrCancelOrderAdmin";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Rating } from "@mui/material";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import StoreEmpty from "@/assets/images/storeEmpty.jpg";
import { Separator } from "@/components/ui/separator";
import { useDispatch } from "react-redux";
import { setStore } from "@/store/features/userSearchSlice";

export default function ViewOrderDetailAdmin(props) {
  const { isOpen, onClose, orderId } = props;
  const [order, setOrder] = useState(null);
  const [isDialogUpdateOrderStatusOpen, setIsDialogUpdateOrderStatusOpen] =
    useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [actionType, setActionType] = useState("");
  const { toast } = useToast();

  const router = useRouter();
  const handleOnClickViewProductDetail = (slug) => {
    router.push(`/${slug}`);
  };

  const dispatch = useDispatch();
  const handleOnclickViewShop = (storeId) => {
    router.push("/search");
    dispatch(setStore(storeId));
  };

  const fetchOneOrderByAdmin = useCallback(async () => {
    if (!orderId) {
      return;
    }
    try {
      const response = await getOneOrderByAdmin(orderId);
      console.log("Order: ", response.result);
      setOrder(response.result);
    } catch (error) {
      toast({
        title: "Lấy thông tin thất bại",
        description: "Không thể lấy thông tin đơn hàng",
        variant: "destructive",
      });
    }
  }, [orderId, toast]);

  useEffect(() => {
    fetchOneOrderByAdmin();
  }, [fetchOneOrderByAdmin]);

  const handleUpdateButtonClick = (order, orderId) => {
    console.log("Update order: ", order);
    console.log("Update order: ", orderId);
    setIsDialogUpdateOrderStatusOpen(true);
    setOrderToUpdate(order);
    setSelectedOrder(orderId);
    setActionType("update");
  };

  const handleCancelButtonClick = (order, orderId) => {
    setIsDialogUpdateOrderStatusOpen(true);
    setOrderToCancel(order);
    setSelectedOrder(orderId);
    setActionType("cancel");
  };

  const confirmUpdateOrderStatus = async () => {
    if (orderToUpdate) {
      try {
        await updateOrderStatusByAdmin(orderToUpdate.id);
        toast({
          title: "Thành công",
          description: `Đơn hàng "#${orderToUpdate.id}" đã được cập nhật trạng thái`,
        });
        fetchOneOrderByAdmin();
        setIsDialogUpdateOrderStatusOpen(false);
      } catch (error) {
        toast({
          title: "Thất bại",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const confirmCancelOrder = async () => {
    if (orderToCancel) {
      try {
        await cancelOrderByAdmin(orderToCancel.id);
        toast({
          title: "Thành công",
          description: `Đơn hàng "#${orderToCancel.id}" đã được hủy`,
        });
        fetchOneOrderByAdmin();
        setIsDialogUpdateOrderStatusOpen(false);
      } catch (error) {
        toast({
          title: "Thất bại",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  function formatCurrency(value) {
    return Number(value).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  function getStatusOrder(status) {
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
      default:
        return "N/A";
    }
  }

  function getTransactionStatusOrder(status) {
    switch (status) {
      case "WAITING":
        return "Chờ thanh toán";
      case "SUCCESS":
        return "Đã thanh toán";
      default:
        return "N/A";
    }
  }

  function getPaymentMethodOrder(status) {
    switch (status) {
      case "COD":
        return "COD";
      case "VN_PAY":
        return "VN PAY";
      default:
        return "N/A";
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const timePart = `${hours
      .toString()
      .padStart(2, "0")}:${minutes}:${seconds}`;
    const datePart = date.toLocaleDateString("vi-VN").replace(/\//g, "-");

    return `${timePart} ${datePart}`;
  }

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerTitle></DrawerTitle>
      <DrawerDescription></DrawerDescription>
      <DrawerContent className="h-full z-[100]">
        <ScrollArea className="p-4 mr-10 ml-10 overflow-auto min-h-full">
          <div className="flex flex-col h-full">
            <div className="flex flex-col space-y-4 items-start justify-center">
              <div className="w-full flex items-center justify-between">
                <DrawerClose className="flex items-center space-x-2 m-4">
                  <Button variant="outline" size="icon" className="h-7 w-7">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Label className="hover:cursor-pointer text-2xl">
                    Chi tiết đơn hàng
                  </Label>
                </DrawerClose>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <DrawerClose>
                    <Button variant="outline" size="sm">
                      Đóng
                    </Button>
                  </DrawerClose>
                </div>
              </div>
              <Separator></Separator>
              <div className="w-full flex flex-col space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Label className="text-2xl font-bold">
                        Mã đơn hàng: #{order?.id}
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {getStatusOrder(order?.currentStatus)}
                        </Badge>
                        <Badge variant="outline">
                          {getTransactionStatusOrder(
                            order?.currentStatusTransaction
                          )}
                        </Badge>
                        <Badge variant="outline">
                          {getPaymentMethodOrder(order?.paymentMethod)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Label className="text-sm mt-2 ml-4">
                    Ngày đặt hàng: {formatDate(order?.createdAt)}
                  </Label>
                </div>
                <div className="space-x-4 flex items-center justify-end">
                  {order?.currentStatus === "DELIVERED" ||
                  order?.currentStatus === "CANCELLED" ? (
                    ""
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleCancelButtonClick(order, order.id);
                      }}
                    >
                      <X className="h-4 x-4 mr-2" />
                      Hủy đơn hàng
                    </Button>
                  )}
                  {order?.currentStatus === "WAITING_FOR_SHIPPING" ||
                  order?.currentStatus === "PICKED_UP" ||
                  order?.currentStatus === "OUT_FOR_DELIVERY" ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleUpdateButtonClick(order, order.id);
                      }}
                    >
                      <Pencil className="h-4 x-4 mr-2" />
                      Cập nhật trạng thái
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="flex justify-between space-x-8 mt-2">
                <div className="flex flex-col space-y-8">
                  <Card className="grid gap-4 p-6">
                    <CardTitle className="flex justify-between items-center gap-4 m-4">
                      <Label className="text-2xl font-bold">Sản phẩm</Label>
                      <div className="flex items-center space-x-8">
                        <div
                          className="flex items-center gap-4 hover:cursor-pointer"
                          onClick={() => handleOnclickViewShop(order?.storeId)}
                        >
                          <Image
                            alt="ảnh shop"
                            src={order?.avatarStore || StoreEmpty}
                            height={30}
                            width={30}
                            unoptimized={true}
                            className="rounded-full transition-transform duration-300"
                          />
                          <Label className="text-xl hover:cursor-pointer">
                            {order?.storeName}
                          </Label>
                          <Rating
                            value={Number(order?.ratingStore)}
                            precision={0.1}
                            readOnly
                          ></Rating>
                        </div>
                        <div className="flex items-center gap-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <CircleHelpIcon className="cursor-default" />
                              </TooltipTrigger>
                              <TooltipContent className="flex flex-col gap-2">
                                <Label>Cập Nhật Mới Nhất</Label>
                                <Label>
                                  {formatDate(order?.lastUpdatedAt)}
                                </Label>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardTitle>
                    {order &&
                      order.orderItems.map((item, index) => (
                        <Card key={index} className="mb-4">
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
                                    handleOnClickViewProductDetail(
                                      item.productSlug
                                    )
                                  }
                                />
                                <div className="flex flex-col space-y-2">
                                  <Label
                                    className="text-xl font-bold hover:text-2xl hover:cursor-pointer"
                                    onClick={() =>
                                      handleOnClickViewProductDetail(
                                        item.productSlug
                                      )
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
                  <Card className="lg:col-span-1">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">
                        Tóm tắt đơn hàng
                      </CardTitle>
                      <CardDescription>
                        Tóm tắt chi tiết về đơn hàng #{order?.id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-x-2 items-center">
                          <Label className="col-span-1">Tổng cộng</Label>
                          <Label className="col-span-1 text-center">
                            {`${order?.orderItems.length} item(s)`}
                          </Label>
                          <Label className="col-span-1 text-right">
                            {formatCurrency(order?.total)}
                          </Label>
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 items-center">
                          <Label className="col-span-1">Phí Vận chuyển</Label>
                          <Label className="col-span-1 text-right">
                            {`${formatCurrency(order?.shippingFee)}`}
                          </Label>
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 items-center">
                          <Label className="col-span-1">Shop giảm giá</Label>
                          <Label className="col-span-1 text-right">
                            {`- ${formatCurrency(order?.discount)}`}
                          </Label>
                        </div>
                        <div className="grid grid-cols-3 gap-x-2 items-center">
                          <Label className="col-span-1">
                            Giảm giá vận chuyển
                          </Label>
                          <Label className="col-span-1 text-center">
                            {`${order?.shippingDiscount * 100} %`}
                          </Label>
                          <Label className="col-span-1 text-right">
                            {`- ${formatCurrency(
                              order?.shippingDiscount * order?.shippingFee
                            )}`}
                          </Label>
                        </div>
                        <div className="grid grid-cols-3 gap-x-2 items-center font-bold">
                          <Label className="col-span-2">Tổng thanh toán</Label>
                          <Label className="col-span-1 text-right font-bold">
                            {formatCurrency(order?.grandTotal)}
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex flex-col space-y-8">
                  <Card className="w-full md:w-96 overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">
                        Khách hàng
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <UserRoundCog />
                        <Label>{order?.accountName}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail />
                        <Label>{order?.userEmail || "(chưa có email)"}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone />
                        <Label>
                          {order?.userPhone || "(chưa có số điện thoại)"}
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="w-full md:w-96 overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">
                        Địa chỉ giao hàng
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 flex flex-col">
                      <div className="flex items-center space-x-2">
                        <UserRound />
                        <Label>{order?.recipientName}</Label>
                      </div>
                      {order?.orderPhone ? (
                        <div className="flex items-center space-x-2">
                          <Phone />
                          <Label>{order?.orderPhone}</Label>
                        </div>
                      ) : (
                        ""
                      )}
                      <div>
                        {order?.detailLocate ? (
                          <Label>{`${order?.detailLocate}, `}</Label>
                        ) : (
                          ""
                        )}
                        <Label>{`${order?.detailAddress}`}</Label>
                      </div>
                      <Label>{order?.subDistrict}</Label>
                      <Label>{order?.district}</Label>
                      <Label>{order?.province}</Label>
                    </CardContent>
                  </Card>
                  <Card className="w-full md:w-96 overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">
                        Ghi chú
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Label className="whitespace-normal">
                        {order?.note ? order.note : "(không có ghi chú)"}
                      </Label>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            {isDialogUpdateOrderStatusOpen && (
              <DialogUpdateOrCancelOrderAdmin
                isOpen={isDialogUpdateOrderStatusOpen}
                onClose={() => setIsDialogUpdateOrderStatusOpen(false)}
                onUpdateOrderStatus={confirmUpdateOrderStatus}
                onCancelOrder={confirmCancelOrder}
                orderId={selectedOrder}
                actionType={actionType}
              />
            )}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
