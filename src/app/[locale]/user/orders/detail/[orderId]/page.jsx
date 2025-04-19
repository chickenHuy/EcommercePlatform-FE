"use client";

import { useCallback, useEffect, useState } from "react";
import { getOneOrderByUser } from "@/api/user/orderRequest";
import OrderNotFound from "./order-not-found";
import ViewOrderDetailUser from "./order-detail";
import Loading from "@/components/loading";

export default function OrderDetailUserPage({ params }) {
  const [orderDetail, setOrderDetail] = useState(null);
  const [listOrderStatusHistory, setListOrderStatusHistory] = useState(null);
  const [loadPage, setLoadPage] = useState(true);

  const fetchOneOrderByUser = useCallback(async () => {
    try {
      const response = await getOneOrderByUser(params.orderId);
      const result = response.result;
      setOrderDetail(result);
      setListOrderStatusHistory(result.orderStatusHistories);
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoadPage(false);
    }
  }, [params.orderId]);

  useEffect(() => {
    fetchOneOrderByUser();
  }, [fetchOneOrderByUser]);

  return (
    <>
      {loadPage && (
        <div className="w-full h-screen lg:pl-[300px]">
          <Loading />
        </div>
      )}
      {!orderDetail && !loadPage && (
        <OrderNotFound />
      )}
      {orderDetail && !loadPage && (
        <ViewOrderDetailUser
          orderDetail={orderDetail}
          listOrderStatusHistory={listOrderStatusHistory}
          refreshPage={fetchOneOrderByUser}
        />
      )}
    </>
  )
};