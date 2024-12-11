"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { ArrowUpDown, CalendarCog, ListFilter, SquareX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PaginationAdminTable } from "@/components/paginations/pagination";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  cancelOrderByAdmin,
  getAllOrderByAdmin,
  updateOrderStatusByAdmin,
} from "@/api/admin/orderRequest";
import { useSelector } from "react-redux";
import ViewOrderDetailAdmin from "./viewOrderDetailAdmin";
import DialogUpdateOrderCancelOrderAdmin from "./dialogUpdateOrCancelOrderAdmin";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import ReviewEmpty from "@/assets/images/ReviewEmpty.png";

export default function ManageOrderAdmin() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [sortType, setSortType] = useState("createdAt");
  const [orderType, setOrderType] = useState("desc");
  const [totalElement, setTotalElement] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [filter, setFilter] = useState("");
  const [filterTab, setFilterTab] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogUpdateOrderStatusOpen, setIsDialogUpdateOrderStatusOpen] =
    useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [actionType, setActionType] = useState("");
  var searchTerm = useSelector((state) => state.searchReducer.searchTerm);
  const { toast } = useToast();

  const handleNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSortChange = (value) => {
    setSortType(value);
  };

  const handleOrderChange = (value) => {
    setOrderType(value);
  };

  const handleFilterChange = (value) => {
    setFilterTab(value);
  };

  const handleRowClick = (orderId) => {
    setIsDrawerOpen(true);
    setSelectedOrder(orderId);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleUpdateButtonClick = (order, orderId) => {
    setIsDialogUpdateOrderStatusOpen(true);
    setOrderToUpdate(order);
    setSelectedOrder(orderId);
    setActionType("update");
  };

  const handleCancelButtonClick = (order, orderId) => {
    setIsDialogUpdateOrderStatusOpen(true);
    setOrderToCancel(order);
    setSelectedOrder(orderId);
    setActionType("cancel");
  };

  const handleOnclickTabsTrigger = (value) => {
    setFilter(value);
    setFilterTab(value);
  };

  const confirmUpdateOrderStatus = async () => {
    if (orderToUpdate) {
      try {
        await updateOrderStatusByAdmin(orderToUpdate.id);
        toast({
          title: "Thành công",
          description: `Đơn hàng "#${orderToUpdate.id}" đã được cập nhật trạng thái`,
        });
        fetchAllOrderByAdmin();
        setIsDialogUpdateOrderStatusOpen(false);
      } catch (error) {
        toast({
          title: "Thất bại",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const confirmCancelOrder = async () => {
    if (orderToCancel) {
      try {
        await cancelOrderByAdmin(orderToCancel.id);
        toast({
          title: "Thành công",
          description: `Đơn hàng "#${orderToCancel.id}" đã được hủy`,
        });
        fetchAllOrderByAdmin();
        setIsDialogUpdateOrderStatusOpen(false);
      } catch (error) {
        toast({
          title: "Thất bại",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const fetchAllOrderByAdmin = useCallback(async () => {
    try {
      const response = await getAllOrderByAdmin(
        currentPage,
        sortType,
        orderType,
        searchTerm,
        filterTab
      );
      console.log("Orders: ", response.result.data);
      setOrders(response.result.data);
      setTotalPage(response.result.totalPages);
      setTotalElement(response.result.totalElements);
      setHasNext(response.result.hasNext);
      setHasPrevious(response.result.hasPrevious);
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
  }, [toast, currentPage, sortType, orderType, searchTerm, filterTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterTab, searchTerm]);

  useEffect(() => {
    fetchAllOrderByAdmin();
  }, [fetchAllOrderByAdmin, totalPage, totalElement]);

  function formatCurrency(value) {
    return Number(value).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  function getStatusOrder(status) {
    switch (status) {
      case "ON_HOLD":
        return "Chờ thanh toán";
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "PREPARING":
        return "Chuẩn bị hàng";
      case "WAITING_FOR_SHIPPING":
        return "Chờ giao cho ĐVVC";
      case "PICKED_UP":
        return "Đã giao cho ĐVVC";
      case "OUT_FOR_DELIVERY":
        return "Đang giao hàng";
      case "DELIVERED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "N/A";
    }
  }

  function getTransactionStatusOrder(status) {
    switch (status) {
      case "WAITING":
        return "Chờ thanh toán";
      case "SUCCESS":
        return "Đã thanh toán";
      default:
        return "N/A";
    }
  }

  function getPaymentMethodOrder(status) {
    switch (status) {
      case "COD":
        return "COD";
      case "VN_PAY":
        return "VN PAY";
      default:
        return "N/A";
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const timePart = `${hours
      .toString()
      .padStart(2, "0")}:${minutes}:${seconds}`;
    const datePart = date.toLocaleDateString("vi-VN").replace(/\//g, "-");

    return `${timePart} ${datePart}`;
  }

  const listOrderStatus = [
    { label: "Tất cả", filterKey: "" },
    { label: "Chờ thanh toán", filterKey: "ON_HOLD" },
    { label: "Chờ xác nhận", filterKey: "PENDING" },
    { label: "Đã xác nhận", filterKey: "CONFIRMED" },
    { label: "Chuẩn bị hàng", filterKey: "PREPARING" },
    { label: "Chờ giao cho ĐVVC", filterKey: "WAITING_FOR_SHIPPING" },
    { label: "Đã giao cho ĐVVC", filterKey: "PICKED_UP" },
    { label: "Đang giao hàng", filterKey: "OUT_FOR_DELIVERY" },
    { label: "Hoàn thành", filterKey: "DELIVERED" },
    { label: "Đã hủy", filterKey: "CANCELLED" },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Toaster />
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-4">
          <Tabs value={filter}>
            <div className="flex items-center">
              <TabsList>
                {listOrderStatus.map((item) => (
                  <TabsTrigger
                    key={item.filterKey}
                    value={item.filterKey}
                    onClick={() => handleOnclickTabsTrigger(item.filterKey)}
                  >
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 gap-1">
                      <ArrowUpDown className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Sắp xếp
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sắp xếp</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={orderType}
                      onValueChange={(value) => handleOrderChange(value)}
                    >
                      <DropdownMenuRadioItem value="asc">
                        Tăng dần
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="desc">
                        Giảm dần
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={sortType}
                      onValueChange={(value) => handleSortChange(value)}
                    >
                      <DropdownMenuRadioItem value="createdAt">
                        Ngày đặt hàng
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSortType("");
                        setOrderType("");
                      }}
                    >
                      Không sắp xếp
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {filter === "" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 gap-1">
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Lọc
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Lọc theo trạng thái</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {listOrderStatus.map((item) => (
                        <DropdownMenuCheckboxItem
                          key={item.filterKey}
                          onClick={() => handleFilterChange(item.filterKey)}
                          checked={filterTab === item.filterKey}
                        >
                          {item.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            <TabsContent value={filter}>
              {orders && orders.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Danh sách đơn hàng ({totalElement})</CardTitle>
                    <CardDescription>
                      Quản lý tất cả đơn hàng trên hệ thống
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Đơn hàng</TableHead>
                          <TableHead>Ngày đặt hàng</TableHead>
                          <TableHead>Số điện thoại</TableHead>
                          <TableHead>Địa chỉ</TableHead>
                          <TableHead>Thanh toán</TableHead>
                          <TableHead>Phương thức</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Tổng tiền</TableHead>
                          <TableHead className="hidden md:table-cell">
                            <span className="sr-only">Hành động</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow
                            key={order.id}
                            onClick={() => handleRowClick(order.id)}
                          >
                            <TableCell className="text-center">
                              #{order.id}
                            </TableCell>
                            <TableCell className="text-center">
                              {formatDate(order.createdAt)}
                            </TableCell>
                            <TableCell className="text-center">
                              {order.orderPhone}
                            </TableCell>
                            <TableCell className="text-center">
                              {order.province}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">
                                {getTransactionStatusOrder(
                                  order.currentStatusTransaction
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">
                                {getPaymentMethodOrder(order.paymentMethod)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">
                                {getStatusOrder(order.currentStatus)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              {formatCurrency(order.total)}
                            </TableCell>
                            <TableCell className="md:table-cell text-center">
                              <div>
                                {order.currentStatus ===
                                  "WAITING_FOR_SHIPPING" ||
                                order.currentStatus === "PICKED_UP" ||
                                order.currentStatus === "OUT_FOR_DELIVERY" ? (
                                  <Button
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdateButtonClick(order, order.id);
                                    }}
                                  >
                                    <CalendarCog className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  ""
                                )}
                                {order.currentStatus === "DELIVERED" ||
                                order.currentStatus === "CANCELLED" ? (
                                  ""
                                ) : (
                                  <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCancelButtonClick(order, order.id);
                                    }}
                                  >
                                    <SquareX className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <div className="absolute right-1/2 translate-x-1/2">
                      <PaginationAdminTable
                        currentPage={currentPage}
                        handleNextPage={handleNextPage}
                        handlePrevPage={handlePrevPage}
                        totalPage={totalPage}
                        setCurrentPage={setCurrentPage}
                        hasNext={hasNext}
                        hasPrevious={hasPrevious}
                      />
                    </div>
                  </CardFooter>
                </Card>
              ) : (
                <div className="flex flex-col items-center justify-center border min-h-[700px] mt-6">
                  <Image
                    alt="ảnh trống"
                    className="mx-auto"
                    src={ReviewEmpty}
                    width={400}
                    height={400}
                  ></Image>
                  <Label className="text-xl text-gray-tertiary text-center m-2">
                    Hiện tại không có đơn hàng thuộc trạng thái này
                  </Label>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
      {isDrawerOpen && (
        <ViewOrderDetailAdmin
          isOpen={isDrawerOpen}
          onClose={() => handleCloseDrawer()}
          orderId={selectedOrder}
        />
      )}
      {isDialogUpdateOrderStatusOpen && (
        <DialogUpdateOrderCancelOrderAdmin
          isOpen={isDialogUpdateOrderStatusOpen}
          onClose={() => setIsDialogUpdateOrderStatusOpen(false)}
          onUpdateOrderStatus={confirmUpdateOrderStatus}
          onCancelOrder={confirmCancelOrder}
          orderId={selectedOrder}
          actionType={actionType}
        />
      )}
    </div>
  );
}
