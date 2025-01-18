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
import { Label } from "@/components/ui/label";
import Image from "next/image";
import ReviewEmpty from "@/assets/images/ReviewEmpty.png";
import { formatCurrency, formatDate } from "@/utils/commonUtils";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import DialogUpdateOrCancelOrder from "@/components/dialogs/dialogUpdateOrCancelOrder";

export default function ManageOrderAdmin() {
  const pageSize = 10;
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [orderBy, setOrderBy] = useState("desc");
  const [totalElement, setTotalElement] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [filter, setFilter] = useState("");
  const [filterTab, setFilterTab] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [actionType, setActionType] = useState("");
  var searchTerm = useSelector((state) => state.searchReducer.searchTerm);
  const [isLoading, setIsLoading] = useState(true);
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
    setSortBy(value);
  };

  const handleOrderChange = (value) => {
    setOrderBy(value);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setFilterTab(value);
  };

  const router = useRouter();
  const handleOnClickViewOrderDetail = (orderId) => {
    router.push(`orders/detail/${orderId}`);
  };

  const handleUpdateButtonClick = (order) => {
    setIsDialogOpen(true);
    setOrderToUpdate(order);
    setSelectedOrder(order);
    setActionType("update");
  };

  const handleCancelButtonClick = (order) => {
    setIsDialogOpen(true);
    setOrderToCancel(order);
    setSelectedOrder(order);
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
          description: `Đơn hàng "${orderToUpdate.id}" đã được cập nhật trạng thái`,
        });
        fetchAllOrderByAdmin();
        setIsDialogOpen(false);
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
          description: `Đơn hàng "${orderToCancel.id}" đã được hủy thành công`,
        });
        fetchAllOrderByAdmin();
        setIsDialogOpen(false);
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
        pageSize,
        sortBy,
        orderBy,
        searchTerm,
        filterTab
      );
      setOrders(response.result.data);
      setTotalPage(response.result.totalPages);
      setTotalElement(response.result.totalElements);
      setHasNext(response.result.hasNext);
      setHasPrevious(response.result.hasPrevious);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, sortBy, orderBy, searchTerm, filterTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterTab, searchTerm]);

  useEffect(() => {
    fetchAllOrderByAdmin();
  }, [fetchAllOrderByAdmin, totalPage, totalElement]);

  function getCurrentStatusOrder(status) {
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
    }
  }

  function getTransactionStatusOrder(status) {
    switch (status) {
      case "WAITING":
        return "Chờ thanh toán";
      case "SUCCESS":
        return "Đã thanh toán";
    }
  }

  function getPaymentMethodOrder(status) {
    switch (status) {
      case "COD":
        return "COD";
      case "VN_PAY":
        return "VN PAY";
      default:
        return "COD";
    }
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

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center z-[500] space-y-4 bg-black-secondary">
        <CircularProgress></CircularProgress>
        <p className="text-2xl text-white-primary">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen w-full flex flex-col bg-muted/40">
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
                        <Label className="truncate sr-only sm:not-sr-only hover:cursor-pointer">
                          Sắp xếp
                        </Label>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sắp xếp</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={sortBy}
                        onValueChange={(value) => handleSortChange(value)}
                      >
                        <DropdownMenuRadioItem
                          value="id"
                          className="hover:cursor-pointer"
                        >
                          Mã đơn hàng
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                          value="createdAt"
                          className="hover:cursor-pointer"
                        >
                          Ngày đặt hàng
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                          value="phone"
                          className="hover:cursor-pointer"
                        >
                          Số điện thoại
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                          value="province"
                          className="hover:cursor-pointer"
                        >
                          Địa chỉ
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                          value="grandTotal"
                          className="hover:cursor-pointer"
                        >
                          Tổng tiền
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={orderBy}
                        onValueChange={(value) => handleOrderChange(value)}
                      >
                        <DropdownMenuRadioItem
                          value="desc"
                          className="hover:cursor-pointer"
                        >
                          Giảm dần
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                          value="asc"
                          className="hover:cursor-pointer"
                        >
                          Tăng dần
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSortBy("");
                          setOrderBy("");
                        }}
                        className="hover:cursor-pointer"
                      >
                        Không sắp xếp
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 gap-1">
                        <ListFilter className="h-3.5 w-3.5" />
                        <Label className="truncate sr-only sm:not-sr-only hover:cursor-pointer">
                          Lọc
                        </Label>
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
                          className="hover:cursor-pointer"
                        >
                          {item.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <TabsContent value={filter} className="pt-2">
                {orders && orders.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Danh sách tất cả đơn hàng ({totalElement})
                      </CardTitle>
                      <CardDescription>
                        Quản lý tất cả đơn hàng có trên hệ thống
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-[600px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mã đơn hàng</TableHead>
                            <TableHead>Ngày đặt hàng</TableHead>
                            <TableHead className="hidden sm:table-cell">
                              Số điện thoại
                            </TableHead>
                            <TableHead className="hidden sm:table-cell">
                              Địa chỉ
                            </TableHead>
                            <TableHead className="hidden sm:table-cell">
                              Thanh toán
                            </TableHead>
                            <TableHead className="hidden sm:table-cell">
                              Phương thức
                            </TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Tổng tiền</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow
                              key={order.id}
                              onClick={() =>
                                handleOnClickViewOrderDetail(order.id)
                              }
                              className="h-[50px] hover:cursor-pointer"
                            >
                              <TableCell className="font-medium text-center">
                                {order.id}
                              </TableCell>
                              <TableCell className="font-medium text-center">
                                {formatDate(order.createdAt)}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell font-medium text-center">
                                {order.phone}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell font-medium text-center">
                                {order.province}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell font-medium text-center">
                                <Badge variant="outline">
                                  {getTransactionStatusOrder(
                                    order.currentStatusTransaction
                                  )}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell font-medium text-center">
                                <Badge variant="outline">
                                  {getPaymentMethodOrder(order.paymentMethod)}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium text-center">
                                <Badge variant="outline">
                                  {getCurrentStatusOrder(order.currentStatus)}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium text-center">
                                {formatCurrency(order.grandTotal)}
                              </TableCell>
                              <TableCell className="font-medium text-center">
                                <div className="truncate space-x-2 min-w-[40px]">
                                  {order.currentStatus ===
                                    "WAITING_FOR_SHIPPING" ||
                                  order.currentStatus === "PICKED_UP" ||
                                  order.currentStatus === "OUT_FOR_DELIVERY" ? (
                                    <Button
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateButtonClick(order);
                                      }}
                                    >
                                      <CalendarCog className="h-4 w-4" />
                                    </Button>
                                  ) : null}
                                  {order.currentStatus === "DELIVERED" ||
                                  order.currentStatus === "CANCELLED" ? null : (
                                    <Button
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancelButtonClick(order);
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
                  <div className="flex flex-col items-center justify-center border rounded-lg min-h-[750px]">
                    <Image
                      alt="ảnh trống"
                      className="mx-auto"
                      src={ReviewEmpty}
                      width={200}
                      height={200}
                    />
                    <Label className="text-xl text-gray-tertiary text-center m-2">
                      Hiện tại không có đơn hàng thuộc trạng thái này
                    </Label>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
      {isDialogOpen && (
        <>
          <div className="fixed inset-0 bg-black-primary bg-opacity-85 z-[150]" />
          <DialogUpdateOrCancelOrder
            onOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onUpdateOrderStatus={confirmUpdateOrderStatus}
            onCancelOrder={confirmCancelOrder}
            selectedOrder={selectedOrder}
            actionType={actionType}
          />
        </>
      )}
    </>
  );
}
