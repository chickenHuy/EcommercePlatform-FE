"use client";

import { Users, Store, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserStatisticsAdmin({ adminStatistic }) {
  return (
    <div className="space-y-4 border p-6 rounded-2xl bg-gray-primary bg-opacity-10">
      <span className="ml-4 text-xl font-bold">Phân tích người dùng</span>
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
                {adminStatistic.totalNumberOfCustomers || 0}
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
                {adminStatistic.totalNumberOfSellers || 0}
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
                {adminStatistic.totalNumberOfAdmins || 0}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Tăng trưởng khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Trong ngày
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStatistic.dailyNumberOfCustomer || 0}
                  </div>
                  <div>
                    <span className="text-xs">So với hôm qua</span>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.numberOfCustomersIncreaseCompareYesterday >=
                        0
                          ? `+ ${
                              adminStatistic.numberOfCustomersIncreaseCompareYesterday ||
                              0
                            }`
                          : `- ${
                              -adminStatistic.numberOfCustomersIncreaseCompareYesterday ||
                              0
                            }`}
                      </div>
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.dailyCustomerGrowthRate >= 0
                          ? `+ ${adminStatistic.dailyCustomerGrowthRate || 0}%`
                          : `- ${
                              -adminStatistic.dailyCustomerGrowthRate || 0
                            }%`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Trong tuần
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStatistic.weeklyNumberOfCustomer || 0}
                  </div>
                  <div>
                    <span className="text-xs">So với tuần trước</span>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.numberOfCustomersIncreaseCompareLastWeek >=
                        0
                          ? `+ ${
                              adminStatistic.numberOfCustomersIncreaseCompareLastWeek ||
                              0
                            }`
                          : `- ${
                              -adminStatistic.numberOfCustomersIncreaseCompareLastWeek ||
                              0
                            }`}
                      </div>
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.weeklyCustomerGrowthRate >= 0
                          ? `+ ${adminStatistic.weeklyCustomerGrowthRate || 0}%`
                          : `- ${
                              -adminStatistic.weeklyCustomerGrowthRate || 0
                            }%`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Trong tháng
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStatistic.monthlyNumberOfCustomer || 0}
                  </div>
                  <div>
                    <span className="text-xs">So với tháng trước</span>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.numberOfCustomersIncreaseCompareLastMonth >=
                        0
                          ? `+ ${
                              adminStatistic.numberOfCustomersIncreaseCompareLastMonth ||
                              0
                            }`
                          : `- ${
                              -adminStatistic.numberOfCustomersIncreaseCompareLastMonth ||
                              0
                            }`}
                      </div>
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.monthlyCustomerGrowthRate >= 0
                          ? `+ ${
                              adminStatistic.monthlyCustomerGrowthRate || 0
                            }%`
                          : `- ${
                              -adminStatistic.monthlyCustomerGrowthRate || 0
                            }%`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Trong năm
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStatistic.yearlyNumberOfCustomer || 0}
                  </div>
                  <div>
                    <span className="text-xs">So với năm trước</span>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.numberOfCustomersIncreaseCompareLastYear >=
                        0
                          ? `+ ${
                              adminStatistic.numberOfCustomersIncreaseCompareLastYear ||
                              0
                            }`
                          : `- ${
                              -adminStatistic.numberOfCustomersIncreaseCompareLastYear ||
                              0
                            }`}
                      </div>
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.yearlyCustomerGrowthRate >= 0
                          ? `+ ${adminStatistic.yearlyCustomerGrowthRate || 0}%`
                          : `- ${
                              -adminStatistic.yearlyCustomerGrowthRate || 0
                            }%`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tăng trưởng cửa hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Trong ngày
                  </CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStatistic.dailyNumberOfSeller || 0}
                  </div>
                  <div>
                    <span className="text-xs">So với hôm qua</span>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.numberOfSellersIncreaseCompareYesterday >=
                        0
                          ? `+ ${
                              adminStatistic.numberOfSellersIncreaseCompareYesterday ||
                              0
                            }`
                          : `- ${
                              -adminStatistic.numberOfSellersIncreaseCompareYesterday ||
                              0
                            }`}
                      </div>
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.dailySellerGrowthRate >= 0
                          ? `+ ${adminStatistic.dailySellerGrowthRate || 0}%`
                          : `- ${-adminStatistic.dailySellerGrowthRate || 0}%`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Trong tuần
                  </CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStatistic.weeklyNumberOfSeller || 0}
                  </div>
                  <div>
                    <span className="text-xs">So với tuần trước</span>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.numberOfSellersIncreaseCompareLastWeek >=
                        0
                          ? `+ ${
                              adminStatistic.numberOfSellersIncreaseCompareLastWeek ||
                              0
                            }`
                          : `- ${
                              -adminStatistic.numberOfSellersIncreaseCompareLastWeek ||
                              0
                            }`}
                      </div>
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.weeklySellerGrowthRate >= 0
                          ? `+ ${adminStatistic.weeklySellerGrowthRate || 0}%`
                          : `- ${-adminStatistic.weeklySellerGrowthRate || 0}%`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Trong tháng
                  </CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStatistic.monthlyNumberOfSeller || 0}
                  </div>
                  <div>
                    <span className="text-xs">So với tháng trước</span>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.numberOfSellersIncreaseCompareLastMonth >=
                        0
                          ? `+ ${
                              adminStatistic.numberOfSellersIncreaseCompareLastMonth ||
                              0
                            }`
                          : `- ${
                              -adminStatistic.numberOfSellersIncreaseCompareLastMonth ||
                              0
                            }`}
                      </div>
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.monthlySellerGrowthRate >= 0
                          ? `+ ${adminStatistic.monthlySellerGrowthRate || 0}%`
                          : `- ${
                              -adminStatistic.monthlySellerGrowthRate || 0
                            }%`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Trong năm
                  </CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStatistic.yearlyNumberOfSeller || 0}
                  </div>
                  <div>
                    <span className="text-xs">So với năm trước</span>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.numberOfSellersIncreaseCompareLastYear >=
                        0
                          ? `+ ${
                              adminStatistic.numberOfSellersIncreaseCompareLastYear ||
                              0
                            }`
                          : `- ${
                              -adminStatistic.numberOfSellersIncreaseCompareLastYear ||
                              0
                            }`}
                      </div>
                      <div className="text-sm font-bold text-muted-foreground">
                        {adminStatistic.yearlySellerGrowthRate >= 0
                          ? `+ ${adminStatistic.yearlySellerGrowthRate || 0}%`
                          : `- ${-adminStatistic.yearlySellerGrowthRate || 0}%`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
