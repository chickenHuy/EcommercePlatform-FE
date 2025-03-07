"use client";

import { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/utils";

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "hsl(var(--chart-1))",
  },
};

function generateYearOptions() {
  const currentYear = new Date().getFullYear();
  const startYear = 2020;
  return Array.from({ length: currentYear - startYear + 1 }, (_, index) => {
    const year = currentYear - index;
    return {
      value: year.toString(),
      label: year.toString(),
    };
  });
}

function generateMonthOptions() {
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2000, i, 1);
    return {
      value: String(i + 1).padStart(2, "0"),
      label: date.toLocaleString("vi-VN", { month: "long" }),
    };
  });
}

export function ChartAdmin({
  chartData,
  totalRevenueOneYear,
  setYear,
  setMonth,
}) {
  const [selectedYear, setSelectedYear] = useState(() =>
    new Date().getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return String(new Date().getMonth() + 1).padStart(2, "0");
  });

  const yearOptions = useMemo(() => generateYearOptions(), []);
  const monthOptions = useMemo(() => generateMonthOptions(), []);

  const filteredChartData = useMemo(() => {
    const yearMonthPrefix = `${selectedYear}-${selectedMonth}`;
    return (
      chartData.filter((item) => item.date.startsWith(yearMonthPrefix)) || []
    );
  }, [selectedYear, selectedMonth, chartData]);

  const total = useMemo(
    () => filteredChartData.reduce((acc, curr) => acc + (curr.revenue || 0), 0),
    [filteredChartData]
  );

  const handleYearChange = (value) => {
    setSelectedYear(value);
    setYear(parseInt(value, 10));
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    setMonth(parseInt(value, 10));
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Biểu đồ doanh thu</CardTitle>
          <CardDescription>
            Hiển thị doanh thu theo các ngày trong tháng
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 px-6 py-4 sm:py-6">
          <Select value={selectedYear} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Năm" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Tháng" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="flex items-center justify-center space-x-10">
          <div className="mb-4 flex items-center space-x-2">
            <span className="text-xl font-bold text-muted-foreground">
              {monthOptions.find((m) => m.value === selectedMonth)?.label}:
            </span>
            <span className="text-2xl font-bold">{formatCurrency(total)}</span>
          </div>
          <div className="mb-4 flex items-center space-x-2">
            <span className="text-xl font-bold text-muted-foreground">
              Năm {selectedYear}:
            </span>
            <span className="text-2xl font-bold">
              {formatCurrency(totalRevenueOneYear)}
            </span>
          </div>
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={filteredChartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.getDate();
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value / 1000000} tr`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="revenue"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  }}
                  valueFormatter={(value) => `${value.toLocaleString()} VNĐ`}
                />
              }
            />
            <Bar dataKey="revenue" fill={`var(--color-revenue)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
