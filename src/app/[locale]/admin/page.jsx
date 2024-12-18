"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAdminStatistic,
  getRevenueOneYear,
} from "@/api/admin/adminstatisticsRequest";
import { useToast } from "@/hooks/use-toast";
import OrderStatisticsAdmin from "./orderStatisticsAdmin";
import UserStatisticsAdmin from "./userStatisticsAdmin";
import RevenueStatisticsAdmin from "./revenueStatisticsAdmin";

export default function AdminDashboard() {
  const [adminStatistic, setAdminStatistic] = useState({});
  const [revenueOneYear, setRevenueOneYear] = useState([]);
  const [totalRevenueOneYear, setTotalRevenueOneYear] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const { toast } = useToast();

  const fecthAdminStatistic = useCallback(async () => {
    try {
      const response = await getAdminStatistic();
      const responseROY = await getRevenueOneYear(year, month);
      console.log("adminStatistic: ", response.result);
      setAdminStatistic(response.result);
      console.log(
        "revenueOneYear: ",
        responseROY.result.revenueOneDayResponses
      );
      setRevenueOneYear(responseROY.result.revenueOneDayResponses);
      setTotalRevenueOneYear(responseROY.result.totalRevenueOneYear);
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
  }, [toast, year, month]);

  useEffect(() => {
    fecthAdminStatistic();
  }, [fecthAdminStatistic]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <OrderStatisticsAdmin adminStatistic={adminStatistic} />
        <RevenueStatisticsAdmin
          adminStatistic={adminStatistic}
          revenueOneYear={revenueOneYear}
          totalRevenueOneYear={totalRevenueOneYear}
          setYear={setYear}
          setMonth={setMonth}
        />
        <UserStatisticsAdmin adminStatistic={adminStatistic} />
      </main>
    </div>
  );
}
