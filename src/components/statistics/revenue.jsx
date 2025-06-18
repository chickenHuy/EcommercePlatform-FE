"use client";

import { useState } from "react";
import {
  CalendarIcon,
  TrendingUp,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { getStatistics } from "@/api/admin/revenue";

const chartConfig = {
  amount: {
    label: "Doanh thu",
    color: "hsl(var(--chart-1))",
  },
};

export default function RevenueStatistics() {
  const [filters, setFilters] = useState({
    rangeType: "LAST_7_DAYS",
    groupBy: "DAY",
    from: null,
    to: null,
    productId: "",
    storeId: "",
    limit: 10,
    offset: 0,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  const [chartType, setChartType] = useState("line");
  const [data, setData] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return dateString;
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async () => {
    // Here you would call your API with the filters
    console.log("Applying filters:", filters);
    const res = await getStatistics(
      filters.limit,
      filters.offset,
      filters.from ? format(filters.from, "yyyy-MM-dd") : undefined,
      filters.to ? format(filters.to, "yyyy-MM-dd") : undefined,
      filters.rangeType,
      filters.groupBy,
      filters.productId || undefined,
      filters.storeId || undefined,
      "REVENUE"
    );

    if (res?.result) {
      setData(res.result);
    }

    // Calculate pagination based on totalItems
    const totalPages = Math.ceil(res.result.totalItems / filters.limit);
    setPagination((prev) => ({
      ...prev,
      totalPages,
      pageSize: filters.limit,
    }));

    // For demo purposes, we're using mock data
  };

  const exportToExcel = () => {
    const exportData = data.data.map((item, index) => ({
      STT: index + 1,
      Ngày: formatDate(item.groupKey),
      Loại: item.entityName,
      "Đơn vị": item.unit,
      "Doanh thu": item.amount,
      "Doanh thu (Formatted)": formatCurrency(item.amount),
    }));

    // Thêm tổng kết
    exportData.push({
      STT: "",
      Ngày: "TỔNG CỘNG",
      Loại: "",
      "Đơn vị": "",
      "Doanh thu": data.totalAmount,
      "Doanh thu (Formatted)": formatCurrency(data.totalAmount),
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Thống kê doanh thu");

    const fileName = `thong-ke-doanh-thu-${format(
      new Date(),
      "dd-MM-yyyy"
    )}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handlePageChange = (newPage) => {
    const newOffset = (newPage - 1) * pagination.pageSize;
    setFilters((prev) => ({
      ...prev,
      offset: newOffset,
      limit: pagination.pageSize,
    }));
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    handleApplyFilters();
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: newPageSize,
      currentPage: 1,
      totalPages: Math.ceil(data?.totalItems / newPageSize),
    }));
    setFilters((prev) => ({ ...prev, limit: newPageSize, offset: 0 }));
    handleApplyFilters();
  };

  const chartData = data?.data.map((item) => ({
    date: formatDate(item.groupKey),
    amount: item.amount / 1000000, // Convert to millions for better chart display
    fullAmount: item.amount,
  }));

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Thống kê doanh thu</h1>
        <p className="text-muted-foreground">
          Theo dõi và phân tích doanh thu theo thời gian
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
          <CardDescription>
            Chọn các tiêu chí để lọc dữ liệu thống kê
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rangeType">Khoảng thời gian</Label>
              <Select
                value={filters.rangeType}
                onValueChange={(value) =>
                  handleFilterChange("rangeType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODAY">Hôm nay</SelectItem>
                  <SelectItem value="YESTERDAY">Hôm qua</SelectItem>
                  <SelectItem value="LAST_7_DAYS">7 ngày qua</SelectItem>
                  <SelectItem value="LAST_30_DAYS">30 ngày qua</SelectItem>
                  <SelectItem value="THIS_WEEK">Tuần này</SelectItem>
                  <SelectItem value="LAST_WEEK">Tuần trước</SelectItem>
                  <SelectItem value="THIS_MONTH">Tháng này</SelectItem>
                  <SelectItem value="LAST_MONTH">Tháng trước</SelectItem>
                  <SelectItem value="CUSTOM">Tùy chỉnh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupBy">Nhóm theo</Label>
              <Select
                value={filters.groupBy}
                onValueChange={(value) => handleFilterChange("groupBy", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAY">Ngày</SelectItem>
                  <SelectItem value="WEEK">Tuần</SelectItem>
                  <SelectItem value="MONTH">Tháng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filters.rangeType === "CUSTOM" && (
              <>
                <div className="space-y-2">
                  <Label>Từ ngày</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.from
                          ? format(filters.from, "dd/MM/yyyy")
                          : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.from}
                        onSelect={(date) => handleFilterChange("from", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Đến ngày</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.to
                          ? format(filters.to, "dd/MM/yyyy")
                          : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.to}
                        onSelect={(date) => handleFilterChange("to", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="productId">ID Sản phẩm</Label>
              <Input
                id="productId"
                placeholder="Nhập ID sản phẩm"
                value={filters.productId}
                onChange={(e) =>
                  handleFilterChange("productId", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeId">ID Cửa hàng</Label>
              <Input
                id="storeId"
                placeholder="Nhập ID cửa hàng"
                value={filters.storeId}
                onChange={(e) => handleFilterChange("storeId", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="limit">Số bản ghi/trang</Label>
              <Select
                value={filters.limit.toString()}
                onValueChange={(value) => {
                  const newLimit = Number.parseInt(value);
                  handleFilterChange("limit", newLimit);
                  handlePageSizeChange(newLimit);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={handleApplyFilters}>Áp dụng bộ lọc</Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng doanh thu
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(data.totalAmount)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Trong khoảng thời gian đã chọn
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Số mốc thời gian có giao dịch
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalItems}</div>
                <p className="text-xs text-muted-foreground">
                  Mốc thời gian có doanh thu
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Doanh thu trung bình
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(data.totalAmount / data.totalItems)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Trên mỗi mốc thời gian
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Biểu đồ doanh thu</CardTitle>
                  <CardDescription>
                    Doanh thu theo thời gian (triệu VNĐ)
                  </CardDescription>
                </div>
                <Select
                  value={chartType}
                  onValueChange={(value) => setChartType(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Đường</SelectItem>
                    <SelectItem value="bar">Cột</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name) => [
                              formatCurrency(Number(value) * 1000000),
                              "Doanh thu",
                            ]}
                          />
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="var(--color-amount)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-amount)" }}
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name) => [
                              formatCurrency(Number(value) * 1000000),
                              "Doanh thu",
                            ]}
                          />
                        }
                      />
                      <Bar dataKey="amount" fill="var(--color-amount)" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Chi tiết dữ liệu</CardTitle>
                  <CardDescription>
                    Bảng dữ liệu chi tiết theo từng ngày
                  </CardDescription>
                </div>
                <Button onClick={exportToExcel} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Xuất Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">STT</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead className="text-right">Doanh thu</TableHead>
                    <TableHead>Đơn vị</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {filters.offset + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatDate(item.groupKey)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.amount)}
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Hiển thị{" "}
                  {(pagination.currentPage - 1) * pagination.pageSize + 1} -{" "}
                  {Math.min(
                    pagination.currentPage * pagination.pageSize,
                    data.totalItems
                  )}{" "}
                  trong tổng số {data.totalItems} bản ghi
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        const pageNumber = i + 1;
                        return (
                          <Button
                            key={pageNumber}
                            variant={
                              pagination.currentPage === pageNumber
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(pageNumber)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNumber}
                          </Button>
                        );
                      }
                    )}

                    {pagination.totalPages > 5 && (
                      <>
                        <span className="text-muted-foreground">...</span>
                        <Button
                          variant={
                            pagination.currentPage === pagination.totalPages
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handlePageChange(pagination.totalPages)
                          }
                          className="w-8 h-8 p-0"
                        >
                          {pagination.totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
