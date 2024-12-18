"use client";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Truck,
  Users,
  XCircle,
  Clock,
  CircleCheck,
  Store,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/commonUtils";
import { useCallback, useEffect, useState } from "react";
import {
  getAdminStatistic,
  getRevenueOneYear,
} from "@/api/admin/adminstatisticsRequest";
import { useToast } from "@/hooks/use-toast";
import { ChartAdmin } from "./chartAdmin";

export default function Dashboard() {
  const [adminStatistic, setAdminStatistic] = useState({});
  const [revenueOneYear, setRevenueOneYear] = useState([]);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
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
        <div className="space-y-4 border p-6 rounded-2xl bg-gray-primary bg-opacity-10">
          <span className="ml-4">Danh sách đơn hàng</span>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Chờ giao cho ĐVVC
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStatistic.numberOfOrdersWaitingForShipping}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Đã giao cho ĐVVC
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStatistic.numberOfOrdersPickedUp}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Đang giao hàng
                  </CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStatistic.numberOfOrdersOutForDelivery}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Giao thành công
                  </CardTitle>
                  <CircleCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStatistic.numberOfOrdersDelivered}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Đơn hàng mới
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStatistic.numberOfOrdersPending}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Đơn đã hủy
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStatistic.numberOfOrdersCancelled}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div className="space-y-4 border p-6 rounded-2xl bg-gray-primary bg-opacity-10">
          <span className="ml-4">Phân tích doanh thu</span>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Doanh thu trong ngày
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold">
                    {formatCurrency(adminStatistic.dailyRevenue)}
                  </div>
                  <div>
                    <span className="text-xs">So với hôm qua</span>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.revenueIncreaseCompareYesterday >= 0
                          ? `+ ${formatCurrency(
                              adminStatistic.revenueIncreaseCompareYesterday
                            )}`
                          : formatCurrency(
                              adminStatistic.revenueIncreaseCompareYesterday
                            )}
                      </div>
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.dailyRevenueGrowthRate >= 0
                          ? `+ ${adminStatistic.dailyRevenueGrowthRate}%`
                          : `- ${-adminStatistic.dailyRevenueGrowthRate}%`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Doanh thu trong tuần
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold">
                    {formatCurrency(adminStatistic.weeklyRevenue)}
                  </div>
                  <div>
                    <span className="text-xs">So với tuần trước</span>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.revenueIncreaseCompareLastWeek >= 0
                          ? `+ ${formatCurrency(
                              adminStatistic.revenueIncreaseCompareLastWeek
                            )}`
                          : formatCurrency(
                              adminStatistic.revenueIncreaseCompareLastWeek
                            )}
                      </div>
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.weeklyRevenueGrowthRate >= 0
                          ? `+ ${adminStatistic.weeklyRevenueGrowthRate}%`
                          : `- ${-adminStatistic.weeklyRevenueGrowthRate}%`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Doanh thu trong tháng
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold">
                    {formatCurrency(adminStatistic.monthlyRevenue)}
                  </div>
                  <div>
                    <span className="text-xs">So với tháng trước</span>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.revenueIncreaseCompareLastMonth >= 0
                          ? `+ ${formatCurrency(
                              adminStatistic.revenueIncreaseCompareLastMonth
                            )}`
                          : formatCurrency(
                              adminStatistic.revenueIncreaseCompareLastMonth
                            )}
                      </div>
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.monthlyRevenueGrowthRate >= 0
                          ? `+ ${adminStatistic.monthlyRevenueGrowthRate}%`
                          : `- ${-adminStatistic.monthlyRevenueGrowthRate}%`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Doanh thu trong năm
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold">
                    {formatCurrency(adminStatistic.yearlyRevenue)}
                  </div>
                  <div>
                    <span className="text-xs">So với năm trước</span>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.revenueIncreaseCompareLastYear >= 0
                          ? `+ ${formatCurrency(
                              adminStatistic.revenueIncreaseCompareLastYear
                            )}`
                          : formatCurrency(
                              adminStatistic.revenueIncreaseCompareLastYear
                            )}
                      </div>
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.yearlyRevenueGrowthRate >= 0
                          ? `+ ${adminStatistic.yearlyRevenueGrowthRate}%`
                          : `- ${-adminStatistic.yearlyRevenueGrowthRate}%`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4 grid gap-4 grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle>Top 5 cửa hàng đạt doanh thu cao nhất</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên cửa hàng</TableHead>
                        <TableHead>Doanh thu</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminStatistic.top5StoresByRevenue
                        ? adminStatistic.top5StoresByRevenue.map((store) => (
                            <TableRow key={store.storeId}>
                              <TableCell className="text-center">
                                {store.storeName}
                              </TableCell>
                              <TableCell className="text-center">
                                {formatCurrency(store.revenue)}
                              </TableCell>
                            </TableRow>
                          ))
                        : null}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <Card>
                  <ChartAdmin
                    chartData={revenueOneYear}
                    setYear={setYear}
                    setMonth={setMonth}
                  />
                </Card>
              </Card>
            </div>
          </div>
        </div>
        <div className="space-y-4 border p-6 rounded-2xl bg-gray-primary bg-opacity-10">
          <span className="ml-4">Phân tích người dùng</span>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Số lượng khách hàng
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStatistic.totalNumberOfCustomers}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Số lượng cửa hàng
                  </CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStatistic.totalNumberOfSellers}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Số lượng quản trị viên
                  </CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStatistic.totalNumberOfAdmins}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Tăng trưởng khách hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          So với hôm qua
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          +{" "}
                          {
                            adminStatistic.numberOfCustomersIncreaseCompareYesterday
                          }
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          So với tuần trước
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          +{" "}
                          {
                            adminStatistic.numberOfCustomersIncreaseCompareLastWeek
                          }
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          So với tháng trước
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          +{" "}
                          {
                            adminStatistic.numberOfCustomersIncreaseCompareLastMonth
                          }
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          So với năm trước
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          +{" "}
                          {
                            adminStatistic.numberOfCustomersIncreaseCompareLastYear
                          }
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
