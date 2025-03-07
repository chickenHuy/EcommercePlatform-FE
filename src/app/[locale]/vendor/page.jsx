"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils";
import { getStoreStatistic } from "@/api/vendor/storeStatisticRequest";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useCallback } from "react";
import ChartSeller from "./chartSeller";

export default function Dashboard() {
  const [storeStatistic, setStoreStatistic] = useState({
    dailyRevenue: 0,
    numberOfOrdersCancelled: 0,
    numberOfOrdersConfirmed: 0,
    numberOfOrdersDelivered: 0,
    numberOfOrdersPending: 0,
    numberOfOrdersPreparing: 0,
    numberOfOrdersWaitingForShipping: 0,
    numberOfProductsOutOfStock: 0,
    numberOfProductsTemporarilyBlocked: 0,
  });
  const { toast } = useToast();

  const fetchStoreStatistic = useCallback(async () => {
    try {
      const response = await getStoreStatistic();
      setStoreStatistic(response.result);
    } catch (error) {
      toast({
        title: "Thất bại",
        description:
          error.message === "Unauthenticated"
            ? "Phiên làm việc hết hạn. Vui lòng đăng nhập lại!!!"
            : error.message,
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchStoreStatistic();
  }, [fetchStoreStatistic]);

  const toDoListAbove = [
    {
      nameStatus: "Đã xác nhận",
      number: storeStatistic.numberOfOrdersConfirmed,
    },
    {
      nameStatus: "Chuẩn bị hàng",
      number: storeStatistic.numberOfOrdersPreparing,
    },
    {
      nameStatus: "Chờ vận chuyển",
      number: storeStatistic.numberOfOrdersWaitingForShipping,
    },
    {
      nameStatus: "Đơn đã hủy",
      number: storeStatistic.numberOfOrdersCancelled,
    },
  ];

  const toDoListBelow = [
    {
      nameStatus: "Sản phẩm bị tạm khóa",
      number: storeStatistic.numberOfProductsTemporarilyBlocked,
    },
    {
      nameStatus: "Sản phẩm hết hàng",
      number: storeStatistic.numberOfProductsOutOfStock,
    },
  ];

  const salesAnalysis = [
    {
      nameStatus: "Doanh thu ngày",
      number: formatCurrency(storeStatistic.dailyRevenue),
    },
    {
      nameStatus: "Đơn hàng hoàn thành",
      number: storeStatistic.numberOfOrdersDelivered,
    },
    {
      nameStatus: "Đơn hàng mới",
      number: storeStatistic.numberOfOrdersPending,
    },
  ];

  const chartData =
    storeStatistic.storeSalesLastSevenDays
      ?.map((sale) => {
        const [year, month, day] = sale.date.split("-");
        const formattedDate = `${day}-${month}-${year}`;
        return {
          date: formattedDate,
          revenue: sale.revenue,
        };
      })
      ?.reverse() || [];
  console.log("chartData: ", chartData);

  return (
    <div className="p-6 pt-20 space-y-8">
      {/* To-Do List */}
      <Card className="shadow-lg border rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Danh sách cần làm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {toDoListAbove.map((item, index) => (
              <Card
                key={index}
                className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-6 text-center">
                  <p className="text-lg">
                    {item.nameStatus || "(trạng thái đơn hàng)"}
                  </p>
                  <p className="text-3xl font-bold mt-2 text-blue-600">
                    {item.number || 0}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Separator className="my-6" />
          <div className="grid grid-cols-2 gap-6">
            {toDoListBelow.map((item, index) => (
              <Card
                key={index}
                className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-6 text-center">
                  <p className="text-lg">
                    {item.nameStatus || "(trạng thái sản phẩm)"}
                  </p>
                  <p className="text-3xl font-bold mt-2 text-red-600">
                    {item.number || 0}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sales Analysis */}
      <Card className="shadow-lg border rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Phân tích bán hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Card className="mb-6 border rounded-lg shadow-md">
            <ChartSeller chartData={chartData} />
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {salesAnalysis.map((item, index) => (
              <Card
                key={index}
                className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-6 text-center">
                  <p className="text-lg">
                    {item.nameStatus || "(trạng thái đơn hàng)"}
                  </p>
                  <p className="text-3xl font-bold mt-2 text-green-600">
                    {item.number || 0}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
