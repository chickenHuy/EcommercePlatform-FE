"use client";

import { getOneOrderByUser } from "@/api/user/orderRequest";
import { CircularProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import OrderNotFound from "./order-not-found";
import ViewOrderDetailUser from "./order-detail";

export default function OrderDetailUserPage({ params }) {
  const [orderDetail, setOrderDetail] = useState(null);
  const [listOrderStatusHistory, setListOrderStatusHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOneOrderByUser = useCallback(async () => {
    try {
      const response = await getOneOrderByUser(params.orderId);
      setOrderDetail(response.result);
      setListOrderStatusHistory(response.result.orderStatusHistories);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [params.orderId]);

  useEffect(() => {
    fetchOneOrderByUser();
  }, [fetchOneOrderByUser]);

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
    <ViewOrderDetailUser
      orderDetail={orderDetail}
      listOrderStatusHistory={listOrderStatusHistory}
      refreshPage={fetchOneOrderByUser}
    />
  );
}
