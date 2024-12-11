"use client";

import { ArrowUpDown, CalendarCog, ListFilter, SquareX } from "lucide-react";
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
import { PaginationAdminTable } from "@/components/paginations/pagination";
import { Toaster } from "@/components/ui/toaster";
import { useCallback, useEffect, useState } from "react";
import {
  cancelOrderBySeller,
  getAllOrderBySeller,
  updateOrderStatusBySeller,
} from "@/api/vendor/orderRequest";
import { Input } from "@/components/ui/input";
import { Search } from "@mui/icons-material";
import { useToast } from "@/hooks/use-toast";
import DialogUpdateOrCancelOrderSeller from "./dialogUpdateOrCancelOrderSeller";
import ViewOrderDetailSeller from "./viewOrderDetailSeller";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "@/store/features/orderFilterSlice";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import ReviewEmpty from "@/assets/images/ReviewEmpty.png";

export default function ManageOrderSeller() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [sortType, setSortType] = useState("createdAt");
  const [orderType, setOrderType] = useState("desc");
  const [totalElement, setTotalElement] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [search, setSearch] = useState("");
  const filter = useSelector((state) => state.orderFilterReducer.filter);
  const showFilter = useSelector(
    (state) => state.orderFilterReducer.showFilter
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogUpdateOrderStatusOpen, setIsDialogUpdateOrderStatusOpen] =
    useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [actionType, setActionType] = useState("");
  const dispatch = useDispatch();
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
    dispatch(setFilter(value));
  };

  const handleOnChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const dropdownItems = [
    { label: "Tất cả", filterKey: "" },
    { label: "Chờ thanh toán", filterKey: "ON_HOLD" },
    { label: "Chờ xác nhận", filterKey: "PENDING" },
    { label: "Đã xác nhận", filterKey: "CONFIRMED" },
    { label: "Chuẩn bị hàng", filterKey: "PREPARING" },
    { label: "Chờ vận chuyển", filterKey: "WAITING_FOR_SHIPPING" },
    { label: "Đã giao cho ĐVVC", filterKey: "PICKED_UP" },
    { label: "Đang giao hàng", filterKey: "OUT_FOR_DELIVERY" },
    { label: "Hoàn thành", filterKey: "DELIVERED" },
    { label: "Đã hủy", filterKey: "CANCELLED" },
  ];

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

  const confirmUpdateOrderStatus = async () => {
    if (orderToUpdate) {
      try {
        await updateOrderStatusBySeller(orderToUpdate.id);
        toast({
          title: "Thành công",
          description: `Đơn hàng "#${orderToUpdate.id}" đã được cập nhật trạng thái`,
        });
        fetchAllOrderBySeller();
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
        await cancelOrderBySeller(orderToCancel.id);
        toast({
          title: "Thành công",
          description: `Đơn hàng "#${orderToCancel.id}" đã được hủy`,
        });
        fetchAllOrderBySeller();
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

  const fetchAllOrderBySeller = useCallback(async () => {
    try {
      const response = await getAllOrderBySeller(
        currentPage,
        sortType,
        orderType,
        search,
        filter
      );
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
  }, [toast, currentPage, sortType, orderType, search, filter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    fetchAllOrderBySeller();
  }, [fetchAllOrderBySeller, totalPage, totalElement]);

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

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 pt-16">
      <Toaster />
      <div className="flex flex-col sm:gap-4 sm:py-4">
        {orders && orders.length > 0 ? (
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-4">
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
              {showFilter && (
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
                    {dropdownItems.map((item) => (
                      <DropdownMenuCheckboxItem
                        key={item.filterKey}
                        onClick={() => handleFilterChange(item.filterKey)}
                        checked={filter === item.filterKey}
                      >
                        {item.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <Card>
              <CardHeader className="">
                <CardTitle>Danh sách đơn hàng ({totalElement})</CardTitle>
                <CardDescription>
                  Quản lý tất cả đơn hàng trong cửa hàng
                </CardDescription>
                <div className="ml-auto flex items-center gap-2 w-1/2">
                  <Input
                    onChange={(e) => handleOnChange(e.target.value)}
                  ></Input>
                  <Search className="h-5 w-5 hover:cursor-pointer" />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Đơn hàng</TableHead>
                      <TableHead>Ngày đặt hàng</TableHead>
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
                          <Badge variant="outline">
                            {getStatusOrder(order.currentStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {formatCurrency(order.total)}
                        </TableCell>
                        <TableCell className="md:table-cell text-center">
                          {order.currentStatus === "PENDING" ||
                          order.currentStatus === "CONFIRMED" ||
                          order.currentStatus === "PREPARING" ? (
                            <div>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateButtonClick(order, order.id);
                                }}
                              >
                                <CalendarCog className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelButtonClick(order, order.id);
                                }}
                              >
                                <SquareX className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            ""
                          )}
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
          </main>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[700px]">
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
      </div>
      {isDrawerOpen && (
        <ViewOrderDetailSeller
          isOpen={isDrawerOpen}
          onClose={() => handleCloseDrawer()}
          orderId={selectedOrder}
        />
      )}
      {isDialogUpdateOrderStatusOpen && (
        <DialogUpdateOrCancelOrderSeller
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
