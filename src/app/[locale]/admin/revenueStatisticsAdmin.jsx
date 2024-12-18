"use client";

import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartAdmin } from "./chartAdmin";
import { formatCurrency } from "@/utils/commonUtils";
import storeEmpty from "@/assets/images/storeEmpty.jpg";
import Image from "next/image";
import { Label } from "@/components/ui/label";

export default function RevenueStatisticsAdmin({
  adminStatistic,
  revenueOneYear,
  totalRevenueOneYear,
  setYear,
  setMonth,
}) {
  return (
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
                {formatCurrency(adminStatistic.dailyRevenue || 0)}
              </div>
              <div>
                <span className="text-xs">So với hôm qua</span>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-muted-foreground">
                    {adminStatistic.revenueIncreaseCompareYesterday >= 0
                      ? `+ ${formatCurrency(
                          adminStatistic.revenueIncreaseCompareYesterday || 0
                        )}`
                      : formatCurrency(
                          adminStatistic.revenueIncreaseCompareYesterday || 0
                        )}
                  </div>
                  <div className="text-sm font-bold text-muted-foreground">
                    {adminStatistic.dailyRevenueGrowthRate >= 0
                      ? `+ ${adminStatistic.dailyRevenueGrowthRate || 0}%`
                      : `- ${-adminStatistic.dailyRevenueGrowthRate || 0}%`}
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
                {formatCurrency(adminStatistic.weeklyRevenue || 0)}
              </div>
              <div>
                <span className="text-xs">So với tuần trước</span>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-muted-foreground">
                    {adminStatistic.revenueIncreaseCompareLastWeek >= 0
                      ? `+ ${formatCurrency(
                          adminStatistic.revenueIncreaseCompareLastWeek || 0
                        )}`
                      : formatCurrency(
                          adminStatistic.revenueIncreaseCompareLastWeek || 0
                        )}
                  </div>
                  <div className="text-sm font-bold text-muted-foreground">
                    {adminStatistic.weeklyRevenueGrowthRate >= 0
                      ? `+ ${adminStatistic.weeklyRevenueGrowthRate || 0}%`
                      : `- ${-adminStatistic.weeklyRevenueGrowthRate || 0}%`}
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
                {formatCurrency(adminStatistic.monthlyRevenue || 0)}
              </div>
              <div>
                <span className="text-xs">So với tháng trước</span>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-muted-foreground">
                    {adminStatistic.revenueIncreaseCompareLastMonth >= 0
                      ? `+ ${formatCurrency(
                          adminStatistic.revenueIncreaseCompareLastMonth || 0
                        )}`
                      : formatCurrency(
                          adminStatistic.revenueIncreaseCompareLastMonth || 0
                        )}
                  </div>
                  <div className="text-sm font-bold text-muted-foreground">
                    {adminStatistic.monthlyRevenueGrowthRate >= 0
                      ? `+ ${adminStatistic.monthlyRevenueGrowthRate || 0}%`
                      : `- ${-adminStatistic.monthlyRevenueGrowthRate || 0}%`}
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
                {formatCurrency(adminStatistic.yearlyRevenue || 0)}
              </div>
              <div>
                <span className="text-xs">So với năm trước</span>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-muted-foreground">
                    {adminStatistic.revenueIncreaseCompareLastYear >= 0
                      ? `+ ${formatCurrency(
                          adminStatistic.revenueIncreaseCompareLastYear || 0
                        )}`
                      : formatCurrency(
                          adminStatistic.revenueIncreaseCompareLastYear || 0
                        )}
                  </div>
                  <div className="text-sm font-bold text-muted-foreground">
                    {adminStatistic.yearlyRevenueGrowthRate >= 0
                      ? `+ ${adminStatistic.yearlyRevenueGrowthRate || 0}%`
                      : `- ${-adminStatistic.yearlyRevenueGrowthRate || 0}%`}
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
              {adminStatistic.top5StoresByRevenue === null ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên cửa hàng</TableHead>
                      <TableHead>Doanh thu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminStatistic.top5StoresByRevenue.map((store) => (
                      <TableRow key={store.storeId}>
                        <TableCell className="text-center">
                          {store.storeName}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatCurrency(store.revenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="min-h-[200px] flex flex-col justify-center items-center space-y-2">
                  <Image
                    alt="ảnh trống"
                    className="mx-auto"
                    src={storeEmpty}
                    width={100}
                    height={100}
                  ></Image>
                  <Label className="text-sm text-gray-tertiary text-center">
                    Hiện tại chưa có cửa hàng nào có doanh thu
                  </Label>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <Card>
              <ChartAdmin
                chartData={revenueOneYear}
                totalRevenueOneYear={totalRevenueOneYear}
                setYear={setYear}
                setMonth={setMonth}
              />
            </Card>
          </Card>
        </div>
      </div>
    </div>
  );
}
