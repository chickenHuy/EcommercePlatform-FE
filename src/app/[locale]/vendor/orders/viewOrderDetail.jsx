"use client";

import { getOrderById } from "@/api/vendor/orderRequest";
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
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function ViewOrderDetail(props) {
  const { isOpen, onClose, orderId } = props;
  const [order, setOrder] = useState(null);
  const { toast } = useToast();

  const fetchOneOrder = useCallback(async () => {
    if (!orderId) {
      return;
    }
    try {
      const response = await getOrderById(orderId);
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
    fetchOneOrder();
  }, [fetchOneOrder]);

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
      case "CONFIRMING":
        return "Chờ xác nhận";
      case "WAITING":
        return "Chờ vận chuyển";
      case "SHIPPING":
        return "Đang vận chuyển";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELED":
        return "Đã hủy";
      case "NA":
        return "N/A";
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
              <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
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
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h2 className="text-2xl font-semibold">
                        Mã đơn hàng: {order?.code}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {getStatusOrder(order ? order.currentStatus : "NA")}
                        </Badge>
                        <Badge variant="outline">Chưa thanh toán</Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm mt-2">
                    Ngày đặt hàng: {formatDate(order?.lastUpdatedAt)}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                  <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <div className="grid gap-4">
                      {order &&
                        order.orderItems.map((item, index) => (
                          <Card key={index}>
                            <CardContent>
                              <div className="flex items-start gap-4 mt-4">
                                <a
                                  href="/vendor/orders"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Image
                                    alt={item.product.name}
                                    className="rounded-md"
                                    height={60}
                                    src={item.product.mainImageUrl}
                                    width={60}
                                  />
                                </a>

                                <div className="flex-1">
                                  <p className="font-bold">
                                    <a
                                      href="/vendor/orders"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:underline hover:text-xl"
                                    >
                                      {item.product.name}
                                    </a>
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
                    </div>

                    <Card className="lg:col-span-1">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                          Tóm tắt đơn hàng
                        </CardTitle>
                        <CardDescription>
                          Tóm tắt chi tiết về đơn hàng của bạn
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
                              {order ? formatCurrency(order?.total) : 0}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-x-2 items-center">
                            <span className="col-span-1">Giảm giá</span>
                            <span className="col-span-1 text-center">
                              Khách hàng mới
                            </span>
                            <span className="col-span-1 text-right">
                              {order ? formatCurrency(order?.discount) : 0}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-x-2 items-center">
                            <span className="col-span-1">Vận chuyển</span>
                            <span className="col-span-1 text-center">
                              Miễn phí
                            </span>
                            <span className="col-span-1 text-right">
                              {order ? formatCurrency(order.shippingTotal) : 0}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-x-2 items-center font-bold">
                            <span className="col-span-2">Tổng thanh toán</span>
                            <span className="col-span-1 text-right">
                              {order ? formatCurrency(order.grandTotal) : "N/A"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center p-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          Xem lại đơn hàng của bạn một cách nhanh chóng trên
                          trang Đơn hàng
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline">Xem tất cả đơn hàng</Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                          Khách hàng
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{order?.accountName}</p>
                        <p>{order?.userEmail}</p>
                        <p>{order?.userPhone}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                          Ghi chú
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{order ? order.note : "N/A"}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
