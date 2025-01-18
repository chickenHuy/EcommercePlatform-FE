"use client";

import { getOneOrderBySeller } from "@/api/vendor/orderRequest";
import { CircularProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import ViewOrderDetailSeller from "./order-detail";
import OrderNotFound from "./order-not-found";

export default function OrderDetailSellerPage({ params }) {
  const [orderDetail, setOrderDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOneOrderBySeller = useCallback(async () => {
    try {
      const response = await getOneOrderBySeller(params.orderId);
      setOrderDetail(response.result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [params.orderId]);

  useEffect(() => {
    fetchOneOrderBySeller();
  }, [fetchOneOrderBySeller]);

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
    <ViewOrderDetailSeller
      orderDetail={orderDetail}
      refreshPage={fetchOneOrderBySeller}
    />
  );
}
