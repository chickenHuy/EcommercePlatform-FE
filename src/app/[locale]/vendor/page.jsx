"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-8">
      {/* To-Do List */}
      <Card className="shadow-lg border rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Danh sách cần làm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Chờ xác nhận", "Chờ lấy hàng", "Đã xử lí", "Đơn hủy"].map(
              (item) => (
                <Card
                  key={item}
                  className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <CardContent className="p-6 text-center">
                    <p className="text-lg">{item}</p>
                    <p className="text-3xl font-bold mt-2 text-blue-600">0</p>
                  </CardContent>
                </Card>
              )
            )}
          </div>
          <Separator className="my-6" />
          <div className="grid grid-cols-2 gap-6">
            {["Sản phẩm bị tạm khóa", "Sản phẩm hết hàng"].map((item) => (
              <Card
                key={item}
                className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-6 text-center">
                  <p className="text-lg">{item}</p>
                  <p className="text-3xl font-bold mt-2 text-red-600">0</p>
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
            <CardHeader>
              <CardTitle className="text-lg">
                Biểu đồ doanh số trong ngày
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              {/* Placeholder for chart */}
              <p className="text-gray-500">
                Biểu đồ doanh số sẽ hiển thị ở đây
              </p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Số lượng thêm", "Đơn hàng hoàn thành", "Đơn hàng"].map(
              (item) => (
                <Card
                  key={item}
                  className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <CardContent className="p-6 text-center">
                    <p className="text-lg">{item}</p>
                    <p className="text-3xl font-bold mt-2 text-green-600">0</p>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
