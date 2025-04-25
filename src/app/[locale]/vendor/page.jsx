"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils";
import { getStoreStatistic } from "@/api/vendor/storeStatisticRequest";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useCallback } from "react";
import ChartSeller from "./chartSeller";
import {
  CircleCheck,
  History,
  PackageOpen,
  SquareX,
  Lock,
  CircleSlash2,
  CalendarCheck,
  ChartNoAxesCombined,
  CircleDollarSign,
  PackageCheck,
  PackagePlus,
} from "lucide-react";

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
      icon: <CircleCheck className="m-2 scale-75 sm:scale-100" />,
    },
    {
      nameStatus: "Chuẩn bị hàng",
      number: storeStatistic.numberOfOrdersPreparing,
      icon: <PackageOpen className="m-2 scale-75 sm:scale-100" />,
    },
    {
      nameStatus: "Chờ vận chuyển",
      number: storeStatistic.numberOfOrdersWaitingForShipping,
      icon: <History className="m-2 scale-75 sm:scale-100" />,
    },
    {
      nameStatus: "Đơn đã hủy",
      number: storeStatistic.numberOfOrdersCancelled,
      icon: <SquareX className="m-2 scale-75 sm:scale-100" />,
    },
    {
      nameStatus: "Sản phẩm bị tạm khóa",
      number: storeStatistic.numberOfProductsTemporarilyBlocked,
      icon: <Lock className="m-2 scale-75 sm:scale-100" />,
    },
    {
      nameStatus: "Sản phẩm hết hàng",
      number: storeStatistic.numberOfProductsOutOfStock,
      icon: <CircleSlash2 className="m-2 scale-75 sm:scale-100" />,
    },
  ];

  const salesAnalysis = [
    {
      nameStatus: "Doanh thu ngày",
      number: formatCurrency(storeStatistic.dailyRevenue),
      icon: <CircleDollarSign className="m-2 scale-75 sm:scale-100" />,
    },
    {
      nameStatus: "Đơn hàng hoàn thành",
      number: storeStatistic.numberOfOrdersDelivered,
      icon: <PackageCheck className="m-2 scale-75 sm:scale-100" />,
    },
    {
      nameStatus: "Đơn hàng mới",
      number: storeStatistic.numberOfOrdersPending,
      icon: <PackagePlus className="m-2 scale-75 sm:scale-100" />,
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

  return (
    <div className="flex flex-col gap-5 pt-20 pb-5 lg:px-5 px-2">
      <Card className="shadow-md border rounded-lg pt-3">
        <CardHeader className="flex flex-row items-center gap-3 py-2">
          <CalendarCheck className="scale-125" />
          <span className="text-[1.3em] font-[900]">Danh sách cần làm</span>
        </CardHeader>
        <CardContent className="lg:p-5 p-3">
          <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3">
            {toDoListAbove.map((item, index) => (
              <Card
                key={index}
                className="border rounded-lg shadow-md flex flex-row justify-start items-start"
              >
                <div className="px-4 lg:px-6 pt-5 pb-1 h-full flex-grow">
                  <p className="text-[0.9em]">
                    {item.nameStatus || "(trạng thái đơn hàng)"}
                  </p>
                  <p className="text-[1.8em] font-[900] text-blue-600">
                    {item.number || 0}
                  </p>
                </div>
                {item.icon}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full h-fit flex flex-col shadow-lg border rounded-lg">
        <CardHeader className="flex flex-row items-center gap-3 py-4">
          <ChartNoAxesCombined className="scale-125" />
          <span className="text-[1.3em] font-[900]">Thống kê bán hàng</span>
        </CardHeader>
        <CardContent className="w-full h-fit flex flex-col lg:flex-row justify-center items-start gap-3 p-3">
          <div className="grid md:grid-cols-3 lg:grid-cols-1 grid-cols-2 gap-3 w-full max-w-[650px] h-full">
            {salesAnalysis.map((item, index) => {
              const isLastOddItem =
                salesAnalysis.length % 2 === 1 &&
                index === salesAnalysis.length - 1;

              return (
                <Card
                  key={index}
                  className={`w-full border rounded-lg shadow-md flex flex-row justify-start items-start ${
                    isLastOddItem ? "col-span-2 md:col-span-1" : ""
                  }`}
                >
                  <div className="px-4 lg:px-6 pt-5 pb-1 h-full flex-grow">
                    <p className="text-[0.9em]">
                      {item.nameStatus || "(trạng thái đơn hàng)"}
                    </p>
                    <p className="text-[1.8em] font-[900] text-blue-600">
                      {item.number || 0}
                    </p>
                  </div>
                  {item.icon}
                </Card>
              );
            })}
          </div>
          <ChartSeller chartData={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
