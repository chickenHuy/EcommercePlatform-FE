"use client";

import { getOneOrderByUser } from "@/api/user/orderRequest";
import { CircularProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import OrderNotFound from "./order-not-found";
import ViewOrderDetailUser from "./order-detail";
import { Label } from "@/components/ui/label";

export default function OrderDetailUserPage({ params }) {
  const [orderDetail, setOrderDetail] = useState(null);
  const [listOrderStatusHistory, setListOrderStatusHistory] = useState(null);
  const [loadPage, setLoadPage] = useState(true);

  const fetchOneOrderByUser = useCallback(async () => {
    try {
      const response = await getOneOrderByUser(params.orderId);
      setOrderDetail(response.result);
      setListOrderStatusHistory(response.result.orderStatusHistories);
    } catch (error) {
      console.error(error);
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
        <div className="fixed inset-0 flex flex-col justify-center items-center z-[500] space-y-4 bg-black-secondary">
          <CircularProgress />
          <Label className="text-2xl text-white-primary">
            Đang tải dữ liệu...
          </Label>
        </div>
      )}

      {!orderDetail && <OrderNotFound />}

      {!loadPage && orderDetail && (
        <ViewOrderDetailUser
          orderDetail={orderDetail}
          listOrderStatusHistory={listOrderStatusHistory}
          refreshPage={fetchOneOrderByUser}
        />
      )}
    </>
  );
}
