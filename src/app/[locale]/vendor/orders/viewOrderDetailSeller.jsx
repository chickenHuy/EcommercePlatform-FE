"use client";

import {
  cancelOrderBySeller,
  getOneOrderBySeller,
  updateOrderStatusBySeller,
} from "@/api/vendor/orderRequest";
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
  Mail,
  Pencil,
  Phone,
  UserRoundCog,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import DialogUpdateOrCancelOrderSeller from "./dialogUpdateOrCancelOrderSeller";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

export default function ViewOrderDetailSeller(props) {
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

  const handleOnClickViewAllOrder = () => {
    router.push("/vendor/orders");
  };

  const fetchOneOrderBySeller = useCallback(async () => {
    if (!orderId) {
      return;
    }
    try {
      const response = await getOneOrderBySeller(orderId);
      setOrder(response.result);
    } catch (error) {
      toast({
        title: "Lấy thông tin thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [orderId, toast]);

  useEffect(() => {
    fetchOneOrderBySeller();
  }, [fetchOneOrderBySeller]);

  const handleUpdateButtonClick = (order, orderId) => {
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
        await updateOrderStatusBySeller(orderToUpdate.id);
        toast({
          title: "Thành công",
          description: `Đơn hàng "#${orderToUpdate.id}" đã được cập nhật trạng thái`,
        });
        fetchOneOrderBySeller();
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
        await cancelOrderBySeller(orderToCancel.id);
        toast({
          title: "Thành công",
          description: `Đơn hàng "#${orderToCancel.id}" đã được hủy`,
        });
        fetchOneOrderBySeller();
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
      <DrawerContent>
        <ScrollArea className="p-4 max-h-screen overflow-auto">
          <div className="flex flex-col sm:gap-4 sm:py-4 h-full">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              <div className="mx-auto grid flex-1 auto-rows-max gap-4">
                <div className="flex items-center gap-4 border-b pb-4">
                  <DrawerClose>
                    <Button variant="outline" size="icon" className="h-7 w-7">
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Quay lại</span>
                    </Button>
                  </DrawerClose>
                  <Label className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Chi tiết đơn hàng
                  </Label>
                  <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <DrawerClose>
                      <Button variant="outline" size="sm">
                        Đóng
                      </Button>
                    </DrawerClose>
                  </div>
                </div>
                <div className="flex justify-between items-center w-full">
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
                        </div>
                      </div>
                    </div>
                    <Label className="text-sm mt-2 ml-4">
                      Ngày đặt hàng: {formatDate(order?.createdAt)}
                    </Label>
                  </div>
                  {order?.currentStatus === "PENDING" ||
                  order?.currentStatus === "CONFIRMED" ||
                  order?.currentStatus === "PREPARING" ? (
                    <div className="space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleCancelButtonClick(order, order.id);
                        }}
                      >
                        <X className="h-4 x-4 mr-2" />
                        Hủy đơn hàng
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleUpdateButtonClick(order, order.id);
                        }}
                      >
                        <Pencil className="h-4 x-4 mr-2" />
                        Cập nhật trạng thái
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3 lg:gap-8">
                  <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card className="grid gap-4 p-6">
                      <p className="text-2xl font-bold">Sản phẩm</p>
                      {order &&
                        order.orderItems.map((item, index) => (
                          <Card key={index}>
                            <CardContent>
                              <div className="flex items-center justify-between gap-4 mt-6">
                                <div className="flex items-center space-x-4">
                                  <Image
                                    alt={item.productName}
                                    src={item.productMainImageUrl}
                                    height={100}
                                    width={100}
                                    className="rounded-md transition-transform duration-300 hover:scale-125 hover:mr-2 hover:cursor-pointer"
                                    onClick={() =>
                                      handleOnClickViewProductDetail(
                                        item.productSlug
                                      )
                                    }
                                  />
                                  <div className="flex flex-col space-y-2">
                                    <Label
                                      className="font-bold text-xl hover:text-2xl hover:cursor-pointer"
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
                                      {item.values
                                        ? item.values.join(" | ")
                                        : ""}
                                    </Label>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end justify-center text-right">
                                  <div className="flex items-center">
                                    <Label className="text-2xl font-bold mr-1">
                                      {item.quantity}
                                    </Label>
                                    <Label>
                                      x {formatCurrency(item.price)}
                                    </Label>
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
                          <div className="grid grid-cols-3 items-center">
                            <Label className="col-span-1">Giảm giá</Label>
                            <Label className="col-span-1 text-center">
                              {`${order?.discount * 100} %`}
                            </Label>
                            <Label className="col-span-1 text-right">
                              {`- ${formatCurrency(
                                order?.discount * order?.total
                              )}`}
                            </Label>
                          </div>
                          <div className="grid grid-cols-3 gap-x-2 items-center font-bold">
                            <Label className="col-span-2">
                              Tổng thanh toán
                            </Label>
                            <Label className="col-span-1 text-right font-bold">
                              {formatCurrency(
                                order?.total - order?.discount * order?.total
                              )}
                            </Label>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center p-4 border-t">
                        <Label className="text-sm text-muted-foreground">
                          Xem lại đơn hàng nhanh chóng trên trang Đơn hàng
                        </Label>

                        <Button
                          variant="outline"
                          onClick={() => {
                            handleOnClickViewAllOrder();
                          }}
                        >
                          Xem tất cả đơn hàng
                        </Button>
                      </CardFooter>
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
                        <div className="flex space-x-2">
                          <UserRoundCog />
                          <Label>{order?.accountName}</Label>
                        </div>
                        <div className="flex space-x-2">
                          <Mail />
                          <Label>{order?.userEmail}</Label>
                        </div>
                        <div className="flex space-x-2">
                          <Phone />
                          <Label>{order?.userPhone}</Label>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="w-full md:w-96 overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                          Ghi chú
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Label className="whitespace-normal">
                          {order?.note ? order?.note : "(không có ghi chú)"}
                        </Label>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </main>
            {isDialogUpdateOrderStatusOpen && (
              <DialogUpdateOrCancelOrderSeller
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
