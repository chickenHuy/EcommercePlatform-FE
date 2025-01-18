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
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveItem,
  setFilter,
  setFilterTab,
} from "@/store/features/orderFilterSlice";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import ReviewEmpty from "@/assets/images/ReviewEmpty.png";
import { formatCurrency, formatDate } from "@/utils/commonUtils";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import DialogUpdateOrCancelOrder from "@/components/dialogs/dialogUpdateOrCancelOrder";

export default function ManageOrderSeller() {
  const pageSize = 10;
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [orderBy, setOrderBy] = useState("desc");
  const [totalElement, setTotalElement] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [search, setSearch] = useState("");
  const filterTab = useSelector((state) => state.orderFilterReducer.filterTab);
  const filter = useSelector((state) => state.orderFilterReducer.filter);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [actionType, setActionType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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
    setSortBy(value);
  };

  const handleOrderChange = (value) => {
    setOrderBy(value);
  };

  const handleFilterChange = (value, activeKey) => {
    dispatch(setFilterTab(value));
    dispatch(setFilter(value));
    dispatch(setActiveItem(activeKey));
  };

  const handleOnChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
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

  const router = useRouter();
  const handleOnClickViewOrderDetail = (orderId) => {
    router.push(`orders/detail/${orderId}`);
  };

  const confirmUpdateOrderStatus = async () => {
    if (orderToUpdate) {
      try {
        await updateOrderStatusBySeller(orderToUpdate.id);
        toast({
          description: `Đơn hàng "${orderToUpdate.id}" đã được cập nhật trạng thái`,
        });
        fetchAllOrderBySeller();
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
        await cancelOrderBySeller(orderToCancel.id);
        toast({
          description: `Đơn hàng "${orderToCancel.id}" đã được hủy thành công`,
        });
        fetchAllOrderBySeller();
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

  const fetchAllOrderBySeller = useCallback(async () => {
    try {
      const response = await getAllOrderBySeller(
        currentPage,
        pageSize,
        sortBy,
        orderBy,
        search,
        filterTab
      );
      setOrders(response.result.data);
      setTotalPage(response.result.totalPages);
      setTotalElement(response.result.totalElements);
      setHasNext(response.result.hasNext);
      setHasPrevious(response.result.hasPrevious);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, sortBy, orderBy, search, filterTab]);

  useEffect(() => {
    dispatch(setFilterTab(""));
    dispatch(setFilter(""));
    dispatch(setActiveItem("all"));
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterTab]);

  useEffect(() => {
    fetchAllOrderBySeller();
  }, [fetchAllOrderBySeller, totalPage, totalElement]);

  const dropdownItems = [
    { label: "Tất cả", filterKey: "", activeKey: "all" },
    { label: "Chờ thanh toán", filterKey: "ON_HOLD", activeKey: "onHold" },
    { label: "Chờ xác nhận", filterKey: "PENDING", activeKey: "pending" },
    { label: "Đã xác nhận", filterKey: "CONFIRMED", activeKey: "confirmed" },
    { label: "Chuẩn bị hàng", filterKey: "PREPARING", activeKey: "preparing" },
    {
      label: "Chờ vận chuyển",
      filterKey: "WAITING_FOR_SHIPPING",
      activeKey: "waitingForShipping",
    },
    {
      label: "Đã giao cho ĐVVC",
      filterKey: "PICKED_UP",
      activeKey: "pickedUp",
    },
    {
      label: "Đang giao hàng",
      filterKey: "OUT_FOR_DELIVERY",
      activeKey: "outForDelivery",
    },
    { label: "Hoàn thành", filterKey: "DELIVERED", activeKey: "delivered" },
    { label: "Đã hủy", filterKey: "CANCELLED", activeKey: "cancelled" },
  ];

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
    }
  }

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
      <div className="min-h-screen bg-muted/40 pt-20 pl-6 pr-6">
        <Toaster />
        {orders && orders.length > 0 ? (
          <div className="flex flex-col space-y-6 mb-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="w-1/2 flex items-center relative">
                <Search className="absolute left-2.5 top-2.5 h-5 w-5 hover:cursor-pointer" />
                <Input
                  onChange={(e) => handleOnChange(e.target.value)}
                  placeholder="Tìm kiếm đơn hàng theo mã đơn hàng"
                  className="pl-8"
                />
              </div>
              <div className="flex items-center space-x-2">
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
                      <DropdownMenuRadioItem value="id">
                        Mã đơn hàng
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="createdAt">
                        Ngày đặt hàng
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={orderBy}
                      onValueChange={(value) => handleOrderChange(value)}
                    >
                      <DropdownMenuRadioItem value="desc">
                        Giảm dần
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="asc">
                        Tăng dần
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("");
                        setOrderBy("");
                      }}
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
                    {dropdownItems.map((item, index) => (
                      <DropdownMenuCheckboxItem
                        key={index}
                        onClick={() =>
                          handleFilterChange(item.filterKey, item.activeKey)
                        }
                        checked={filter === item.filterKey}
                        className="hover:cursor-pointer"
                      >
                        {item.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>
                  Danh sách tất cả đơn hàng ({totalElement})
                </CardTitle>
                <CardDescription>
                  Quản lý tất cả đơn hàng có trong cửa hàng
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn hàng</TableHead>
                      <TableHead>Ngày đặt hàng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow
                        key={order.id}
                        onClick={() => handleOnClickViewOrderDetail(order.id)}
                        className="h-[50px] hover:cursor-pointer"
                      >
                        <TableCell className="font-medium text-center">
                          {order.id}
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          <Badge variant="outline">
                            {getStatusOrder(order.currentStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          {formatCurrency(order.total - order.discount)}
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          <div className="truncate space-x-2 min-w-[40px]">
                            {order.currentStatus === "PENDING" ||
                            order.currentStatus === "CONFIRMED" ||
                            order.currentStatus === "PREPARING" ? (
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
                            {order.currentStatus === "PENDING" ||
                            order.currentStatus === "CONFIRMED" ||
                            order.currentStatus === "PREPARING" ? (
                              <Button
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelButtonClick(order);
                                }}
                              >
                                <SquareX className="h-4 w-4" />
                              </Button>
                            ) : null}
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
          </div>
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
