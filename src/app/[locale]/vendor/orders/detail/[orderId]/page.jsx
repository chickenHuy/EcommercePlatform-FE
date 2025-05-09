"use client";

import { getOneOrderBySeller } from "@/api/vendor/orderRequest";
import { useCallback, useEffect, useState } from "react";
import ViewOrderDetailSeller from "./order-detail";
import Loading from "@/components/loading";
import OrderNotFound from "@/components/order-not-found";

export default function OrderDetailSellerPage({ params }) {
  const [orderDetail, setOrderDetail] = useState(null);
  const [loadPage, setLoadPage] = useState(true);

  const fetchOneOrderBySeller = useCallback(async () => {
    try {
      const response = await getOneOrderBySeller(params.orderId);
      setOrderDetail(response.result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadPage(false);
    }
  }, [params.orderId]);

  useEffect(() => {
    fetchOneOrderBySeller();
  }, [fetchOneOrderBySeller]);

  return (
    <>
      {loadPage && (
        <div className="w-full h-screen">
          <Loading />
        </div>
      )}
      {!orderDetail && !loadPage && (
          <OrderNotFound backLocale="/vendor/orders" customPaddingLeft={false}/>
      )}
      {orderDetail && !loadPage && (
        <ViewOrderDetailSeller
          orderDetail={orderDetail}
          refreshPage={fetchOneOrderBySeller}
        />
      )}
    </>
  );
}
