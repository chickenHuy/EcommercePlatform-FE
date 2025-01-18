"use client";

import { CircularProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import ViewOrderDetailAdmin from "./order-detail";
import { getOneOrderByAdmin } from "@/api/admin/orderRequest";
import OrderNotFound from "./order-not-found";

export default function OrderDetailAdminPage({ params }) {
  const [orderDetail, setOrderDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOneOrderByAdmin = useCallback(async () => {
    try {
      const response = await getOneOrderByAdmin(params.orderId);
      setOrderDetail(response.result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [params.orderId]);

  useEffect(() => {
    fetchOneOrderByAdmin();
  }, [fetchOneOrderByAdmin]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center z-[500] space-y-4 bg-black-secondary">
        <CircularProgress></CircularProgress>
        <p className="text-2xl text-white-primary">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!orderDetail) {
    return <OrderNotFound />;
  }

  return (
    <ViewOrderDetailAdmin
      orderDetail={orderDetail}
      refreshPage={fetchOneOrderByAdmin}
    />
  );
}
