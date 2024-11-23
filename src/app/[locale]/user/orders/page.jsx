"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import {
  ArrowUpDown,
  CircleHelp,
  Forklift,
  ListFilter,
  Search,
  Store,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PaginationAdminTable } from "@/components/paginations/pagination";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect, useState } from "react";
import { cancelOrderByUser, getAllOrderByUser } from "@/api/user/orderRequest";
import { TabsContent } from "@radix-ui/react-tabs";
import DialogCancelOrderUser from "./dialogCancelOrderUser";
import ViewOrderDetailUser from "./viewOrderDetailUser";
import { Rating } from "@mui/material";

export default function ManageOrderUser() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [sortType, setSortType] = useState("");
  const [orderType, setOrderType] = useState("");
  const [totalElement, setTotalElement] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [filter, setFilter] = useState("");
  const [filterTab, setFilterTab] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogCancelOrderOpen, setIsDialogCancelOrderOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [actionType, setActionType] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  const handleOnclickTabsTrigger = (value) => {
    setFilter(value);
    setFilterTab(value);
  };

  const handleOnChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCancelButtonClick = (order, orderId) => {
    setIsDialogCancelOrderOpen(true);
    setOrderToCancel(order);
    setSelectedOrder(orderId);
    setActionType("cancel");
  };

  const handleClickCard = (orderId) => {
    setIsDrawerOpen(true);
    setSelectedOrder(orderId);
  };

  const confirmCancelOrder = async () => {
    if (orderToCancel) {
      try {
        await cancelOrderByUser(orderToCancel.id);
        toast({
          title: "Thành công",
          description: `Đơn hàng "#${orderToCancel.id}" đã được hủy`,
        });
        fetchAllOrderByUser();
        setIsDialogCancelOrderOpen(false);
      } catch (error) {
        toast({
          title: "Thất bại",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const fetchAllOrderByUser = useCallback(async () => {
    try {
      const response = await getAllOrderByUser(
        currentPage,
        sortType,
        orderType,
        search,
        filterTab
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
  }, [toast, currentPage, sortType, orderType, search, filterTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterTab, search]);

  useEffect(() => {
    fetchAllOrderByUser();
  }, [fetchAllOrderByUser, totalPage, totalElement]);

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
        return "CHỜ THANH TOÁN";
      case "PENDING":
        return "CHỜ XÁC NHẬN";
      case "CONFIRMED":
        return "ĐÃ XÁC NHẬN";
      case "PREPARING":
        return "CHUẨN BỊ HÀNG";
      case "WAITING_FOR_SHIPPING":
        return "CHỜ GIAO CHO ĐVVC";
      case "PICKED_UP":
        return "ĐÃ GIAO CHO ĐVVC";
      case "OUT_FOR_DELIVERY":
        return "ĐANG GIAO HÀNG";
      case "DELIVERED":
        return "HOÀN THÀNH";
      case "CANCELLED":
        return "ĐÃ HỦY";
      default:
        return "N/A";
    }
  }

  function getMessageOrder(status) {
    switch (status) {
      case "ON_HOLD":
        return "Đơn hàng đang chờ thanh toán";
      case "PENDING":
        return "Đơn hàng đang chờ người bán xác nhận";
      case "CONFIRMED":
        return "Người bán đã xác nhận đơn hàng";
      case "PREPARING":
        return "Người bán đang chuẩn bị hàng";
      case "WAITING_FOR_SHIPPING":
        return "Chờ giao hàng cho ĐVVC";
      case "PICKED_UP":
        return "Đơn hàng đã được giao cho ĐVVC";
      case "OUT_FOR_DELIVERY":
        return "Đơn hàng đang trên đường giao tới bạn, vui lòng chú ý điện thoại";
      case "DELIVERED":
        return "Đơn hàng đã được giao thành công";
      case "CANCELLED":
        return "Đơn hàng đã bị hủy";
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

  const dropdownItems = [
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
    <div className="flex min-h-screen w-full flex-col bg-muted/4 border">
      <Toaster />
      <main className="flex flex-col h-full sm:gap-4 sm:py-4">
        <Tabs value={filter}>
          <div className="flex items-center gap-4 m-4">
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
            <div className="ml-auto flex items-center gap-4">
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
                    {dropdownItems.map((item) => (
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
          <div className="flex justify-end items-center gap-4 m-4">
            <Input
              onChange={(e) => handleOnChange(e.target.value)}
              className="w-2/5"
              placeholder="Tìm kiếm đơn hàng theo mã đơn hàng, tên cửa hàng, tên sản phẩm"
            ></Input>
            <Search className="h-7 w-7 hover:cursor-pointer" />
          </div>
          <TabsContent
            value={filter}
            className="flex flex-col items-center justify-center m-4 space-y-4"
          >
            {orders.length > 0 ? (
              orders.map((order) => (
                <Card key={order.id} className="w-full">
                  <CardTitle className="flex justify-between items-center gap-4 m-4">
                    <div className="flex items-center gap-4">
                      <Image
                        alt="avatar shop"
                        src={order.avatarStore}
                        height={30}
                        width={30}
                        unoptimized={true}
                        className="rounded-full transition-transform duration-300"
                      />
                      <Label className="text-xl">{order.storeName}</Label>
                      <Rating
                        value={order.ratingStore}
                        precision={0.1}
                        readOnly
                      ></Rating>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => handleClickCard(order.id)}
                      >
                        <Forklift />
                        <Label className="hover:cursor-pointer">
                          {getMessageOrder(order.currentStatus)}
                        </Label>
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <CircleHelp className="cursor-default" />
                          </TooltipTrigger>
                          <TooltipContent className="flex flex-col gap-2">
                            <Label>Cập Nhật Mới Nhất</Label>
                            <Label>{formatDate(order.lastUpdatedAt)}</Label>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="w-[1px] h-7 bg-black-primary"></div>
                      <Label className="text-error-dark">
                        {getStatusOrder(order.currentStatus)}
                      </Label>
                    </div>
                  </CardTitle>
                  <CardContent className="flex flex-col items-center justify-center min-h-[150px] space-y-4 border-t hover:cursor-pointer">
                    {order.orderItems && order.orderItems.length > 0 ? (
                      order.orderItems.map((item, index) => (
                        <Card
                          key={index}
                          className="flex w-full justify-between items-center gap-4 mt-4"
                        >
                          <div className="flex items-center gap-4 mb-6 ml-6">
                            <Link
                              href="/user/orders"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Image
                                alt={item.product.name}
                                src={item.product.mainImageUrl}
                                height={100}
                                width={100}
                                unoptimized={true}
                                className="mt-6 rounded-md transition-transform duration-300 hover:scale-125 hover:mr-4"
                              />
                            </Link>
                            <div>
                              <Link
                                href="/user/orders"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                <p className="text-xl font-bold hover:text-2xl">
                                  {item.product.name}
                                </p>
                              </Link>
                              <p className="text-muted-foreground">
                                Phân loại hàng: {item.values.join(" | ")}
                              </p>
                              <p>x{item.quantity}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mr-6">
                            <p className="line-through">
                              {formatCurrency(item.price)}
                            </p>
                            <p>
                              {formatCurrency(
                                item.price - item.price * item.discount
                              )}
                            </p>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <Label className="text-2xl text-error-dark text-center">
                        Đơn hàng không có sản phẩm
                      </Label>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col border-t-2">
                    <div className="flex w-full items-center justify-end gap-2 m-4">
                      <Label>Thành tiền: </Label>
                      <Label className="text-2xl font-bold">
                        {formatCurrency(order?.grandTotal)}
                      </Label>
                    </div>
                    <div className="flex justify-between w-full items-center gap-2 m-4">
                      <div>
                        <Label>Ghi chú của bạn: </Label>
                        <Label className="font-bold">
                          {order.note || "không có ghi chú"}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.currentStatus === "DELIVERED" ||
                        order.currentStatus === "CANCELLED" ? (
                          <Button variant="outline">Mua lại</Button>
                        ) : (
                          ""
                        )}
                        {order.currentStatus === "PICKED_UP" ||
                        order.currentStatus === "OUT_FOR_DELIVERY" ||
                        order.currentStatus === "DELIVERED" ||
                        order.currentStatus === "CANCELLED" ? (
                          ""
                        ) : (
                          <Button
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelButtonClick(order, order.id);
                            }}
                          >
                            Hủy đơn hàng
                          </Button>
                        )}
                        {order.currentStatus === "DELIVERED" ? (
                          <Button variant="outline">Xem đánh giá shop</Button>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Label className="text-2xl text-error-dark text-center">
                Hiện tại bạn không có đơn hàng thuộc trạng thái này
              </Label>
            )}
          </TabsContent>
          <PaginationAdminTable
            currentPage={currentPage}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            totalPage={totalPage}
            setCurrentPage={setCurrentPage}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
          ></PaginationAdminTable>
        </Tabs>
      </main>
      {isDrawerOpen && (
        <ViewOrderDetailUser
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          orderId={selectedOrder}
        />
      )}
      {isDialogCancelOrderOpen && (
        <DialogCancelOrderUser
          isOpen={isDialogCancelOrderOpen}
          onClose={() => setIsDialogCancelOrderOpen(false)}
          onCancelOrder={confirmCancelOrder}
          orderId={selectedOrder}
          actionType={actionType}
        />
      )}
    </div>
  );
}
