import {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getOrderById } from "@/api/vendor/orderRequest";

export default function DrawerOrderDetail({ isOpen, onClose, orderId }) {
  const { toast } = useToast();
  const [order, setOrder] = useState(null);

  const fetchOneOrder = useCallback(async () => {
    if (!orderId) {
      return;
    }
    try {
      const response = await getOrderById(orderId);
      console.log("One order: ", response);
      setOrder(response.result);
    } catch (error) {
      toast({
        title: "Lấy thông tin thất bại",
        description: "Không thể lấy thông tin đơn hàng này",
        variant: "destructive",
      });
    }
  }, [orderId, toast]);

  useEffect(() => {
    fetchOneOrder();
  }, [fetchOneOrder]);

  function getStatusOrder(status) {
    switch (status) {
      case "CONFIRMING":
        return "CHỜ XÁC NHẬN";
      case "WAITING":
        return "CHỜ VẬN CHUYỂN";
      case "SHIPPING":
        return "ĐANG VẬN CHUYỂN";
      case "COMPLETED":
        return "HOÀN THÀNH";
      case "CANCELED":
        return "ĐÃ HỦY";
      default:
        return "HOÀN THÀNH";
    }
  }

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="p-6">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-bold text-center">
            Đơn hàng #{order?.id}
          </DrawerTitle>
          <DrawerDescription className="text-center">
            Thông tin chi tiết về đơn hàng
          </DrawerDescription>
        </DrawerHeader>
        <div className="mt-4 flex flex-col md:flex-row justify-center items-start gap-12 md:gap-24">
          {/* Order Details Section */}
          <div className="flex flex-col gap-3 text-right">
            <h3 className="text-lg font-semibold">Thông tin người nhận</h3>
            <p>
              <strong>Tên: </strong> {order?.recipientName || "N/A"}
            </p>
            <p>
              <strong>Điện thoại: </strong> {order?.phone || "N/A"}
            </p>
            <p>
              <strong>Địa chỉ: </strong> {order?.defaultAddressStr || "N/A"}
            </p>
          </div>
          {/* Order Totals Section */}
          <div className="flex flex-col gap-3 text-left">
            <h3 className="text-lg font-semibold">Tổng quan đơn hàng</h3>
            <p>
              <strong>Tổng tiền sản phẩm: </strong>
              {order?.total?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }) || "0 VND"}
            </p>
            <p>
              <strong>Phí vận chuyển: </strong>
              {order?.shippingTotal?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }) || "0 VND"}
            </p>
            <p>
              <strong>Tổng thanh toán: </strong>
              {order?.grandTotal?.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }) || "0 VND"}
            </p>
            <p>
              <strong>Trạng thái: </strong>{" "}
              {getStatusOrder(order?.currentStatus) || "N/A"}
            </p>
            <p>
              <strong>Ngày tạo: </strong>
              {order?.createdAt
                ? new Date(order.createdAt).toLocaleString("vi-VN")
                : "N/A"}
            </p>
          </div>
        </div>
        <DrawerFooter className="flex justify-center mt-6">
          <DrawerClose asChild>
            <Button variant="outline">Thoát</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
