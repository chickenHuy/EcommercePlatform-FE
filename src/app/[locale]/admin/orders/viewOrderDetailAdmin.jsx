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
                  <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Chi tiết đơn hàng
                  </h1>
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
                        <h2 className="text-2xl font-semibold">
                          Mã đơn hàng: #{order?.id}
                        </h2>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {getStatusOrder(order?.currentStatus)}
                          </Badge>
                          <Badge variant="outline">Chưa thanh toán</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm mt-2">
                      Ngày đặt hàng: {formatDate(order?.lastUpdatedAt)}
                    </div>
                  </div>
                  <div className="space-x-4">
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
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3 lg:gap-8">
                  <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card className="grid gap-4 p-6">
                      <p className="text-2xl font-bold">Sản phẩm</p>
                      {order &&
                        order.orderItems.map((item, index) => (
                          <Card key={index}>
                            <CardContent>
                              <div className="flex items-start gap-4 mt-6">
                                <Link
                                  href="/admin/orders"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Image
                                    alt={item.product.name}
                                    src={item.product.mainImageUrl}
                                    height={100}
                                    width={100}
                                    className="rounded-md transition-transform duration-300 hover:scale-125 hover:mr-2"
                                  />
                                </Link>
                                <div className="flex-1 space-y-2">
                                  <p className="text-xl font-bold">
                                    <Link
                                      href="/vendor/orders"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:underline hover:text-2xl"
                                    >
                                      {item.product.name}
                                    </Link>
                                  </p>
                                  <p>{item.product.brand.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {item.values.join(" | ")}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end justify-center text-right">
                                  <p>
                                    <strong className="text-xl">
                                      {item.quantity}
                                    </strong>{" "}
                                    x {formatCurrency(item.price)}
                                  </p>
                                  <p>
                                    {formatCurrency(item.quantity * item.price)}
                                  </p>
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
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-x-2 items-center">
                            <span className="col-span-1">Tổng cộng</span>
                            <span className="col-span-1 text-center">
                              {`${order?.orderItems.length} item(s)`}
                            </span>
                            <span className="col-span-1 text-right">
                              {formatCurrency(order?.total)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-2 items-center">
                            <span className="col-span-1">Phí Vận chuyển</span>
                            <span className="col-span-1 text-right">
                              {`${formatCurrency(order?.shippingFee)}`}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-x-2 items-center">
                            <span className="col-span-1">Shop giảm giá</span>
                            <span className="col-span-1 text-center">
                              {`${order?.discount * 100} %`}
                            </span>
                            <span className="col-span-1 text-right">
                              {`- ${formatCurrency(
                                order?.discount * order?.total
                              )}`}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-x-2 items-center">
                            <span className="col-span-1">
                              Giảm giá vận chuyển
                            </span>
                            <span className="col-span-1 text-center">
                              {`${order?.shippingDiscount * 100} %`}
                            </span>
                            <span className="col-span-1 text-right">
                              {`- ${formatCurrency(
                                order?.shippingDiscount * order?.shippingFee
                              )}`}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-x-2 items-center font-bold">
                            <span className="col-span-2">Tổng thanh toán</span>
                            <span className="col-span-1 text-right">
                              {formatCurrency(order?.grandTotal)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center p-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          Xem lại đơn hàng nhanh chóng trên trang Đơn hàng
                        </p>
                        <Link href="/admin/orders" className="flex gap-2">
                          <Button variant="outline">Xem tất cả đơn hàng</Button>
                        </Link>
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
                          <p>{order?.accountName}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Mail />
                          <p>{order?.userEmail}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Phone />
                          <p>{order?.userPhone}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="w-full md:w-96 overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                          Địa chỉ giao hàng
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex space-x-2">
                          <UserRound />
                          <p>{order?.recipientName}</p>
                        </div>
                        <p>{`${order?.detailLocate}, ${order?.detailAddress}`}</p>
                        <p>{order?.subDistrict}</p>
                        <p>{order?.district}</p>
                        <p>{order?.province}</p>
                      </CardContent>
                    </Card>
                    <Card className="w-full md:w-96 overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                          Ghi chú
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="whitespace-normal">
                          {order ? order.note : "N/A"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </main>
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
