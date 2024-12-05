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
import { CircularProgress, Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import { setStore } from "@/store/features/userSearchSlice";
import { useDispatch } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { OrderReviewDialog } from "@/components/dialogs/dialogReview";
import ReviewEmpty from "@/assets/images/ReviewEmpty.png";
import Loading from "@/components/loading";

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
  const [isLoading, setIsLoading] = useState(true);

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

  const handleOnClickViewOrderDetail = (orderId) => {
    setIsDrawerOpen(true);
    setSelectedOrder(orderId);
  };

  const router = useRouter();
  const handleOnClickViewProductDetail = (slug) => {
    router.push(`/${slug}`);
  };

  const dispatch = useDispatch();
  const handleOnclickViewShop = (storeId) => {
    router.push("/search");
    dispatch(setStore(storeId));
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
      setIsLoading(false);
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
  }, [fetchAllOrderByUser]);

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
        return "Thanh toán khi nhận hàng";
      case "VN_PAY":
        return "Thanh toán VN PAY";
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
    <div className="flex flex-col space-y-4 bg-white-primary p-2">
      <Toaster />
      {isLoading && (
        <div className="fixed inset-0 flex flex-col justify-center items-center z-50 space-y-4 bg-black-secondary">
          <CircularProgress></CircularProgress>
          <p className="text-2xl text-white-primary">Đang tải dữ liệu...</p>
        </div>
      )}
      <Tabs value={filter}>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <TabsList className="inline-flex flex-wrap h-10 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground overflow-x-auto">
              {[
                listOrderStatus[0],
                listOrderStatus[1],
                listOrderStatus[2],
                listOrderStatus[3],
                listOrderStatus[8],
                listOrderStatus[9],
              ].map((item) => (
                <TabsTrigger
                  key={item.filterKey}
                  value={item.filterKey}
                  onClick={() => handleOnclickTabsTrigger(item.filterKey)}
                  className="ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground whitespace-nowrap"
                >
                  {item.label}
                </TabsTrigger>
              ))}
              <div value="more" className="text-primary font-bold">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-2">
                      Thêm
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {listOrderStatus.map((item) => (
                      <DropdownMenuItem
                        key={item.filterKey}
                        onClick={() => handleOnclickTabsTrigger(item.filterKey)}
                      >
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TabsList>

            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <ArrowUpDown className="h-4 w-4 m-2" />
                    Sắp xếp
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Sắp xếp</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={orderType}
                    onValueChange={handleOrderChange}
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
                    onValueChange={handleSortChange}
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
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Input
              placeholder="Tìm kiếm đơn hàng theo mã đơn hàng, tên cửa hàng, tên sản phẩm"
              className="flex-1"
              onChange={(e) => handleOnChange(e.target.value)}
            />
            <Button size="icon" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value={filter} className="mt-4 space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <Card key={order.id} className="w-full">
                {console.log(order)}
                <CardTitle className="flex justify-between items-center gap-4 m-4">
                  <div
                    className="flex items-center gap-4 hover:cursor-pointer"
                    onClick={() => handleOnclickViewShop(order.storeId)}
                  >
                    <Image
                      alt="ảnh shop"
                      src={order.avatarStore}
                      height={30}
                      width={30}
                      unoptimized={true}
                      className="rounded-full transition-transform duration-300"
                    />
                    <Label className="text-xl hover:cursor-pointer">
                      {order.storeName}
                    </Label>
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
                      onClick={() => handleOnClickViewOrderDetail(order.id)}
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
                    <Badge variant="outline">
                      {getPaymentMethodOrder(order.paymentMethod)}
                    </Badge>
                    <Badge variant="outline">
                      {getTransactionStatusOrder(
                        order.currentStatusTransaction
                      )}
                    </Badge>
                    <div className="w-[1px] h-7 bg-black-primary"></div>
                    <Label className="text-error-dark font-bold">
                      {getStatusOrder(order.currentStatus)}
                    </Label>
                  </div>
                </CardTitle>
                <CardContent
                  className="flex flex-col items-center justify-center min-h-[150px] space-y-4 border-t hover:cursor-pointer"
                  onClick={() => handleOnClickViewOrderDetail(order.id)}
                >
                  {order.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.map((item, index) => (
                      <Card
                        key={index}
                        className="flex w-full justify-between items-center gap-4 mt-4"
                      >
                        <div className="flex items-center gap-4 mb-6 ml-6">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOnClickViewProductDetail(item.productSlug);
                            }}
                          >
                            <Image
                              alt={item.productName}
                              src={item.productMainImageUrl}
                              height={100}
                              width={100}
                              unoptimized={true}
                              className="mt-6 rounded-md transition-transform duration-300 hover:scale-125 hover:mr-4"
                            />
                          </div>
                          <div className="flex flex-col space-y-2">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOnClickViewProductDetail(
                                  item.productSlug
                                );
                              }}
                            >
                              <Label className="text-xl font-bold hover:text-2xl hover:cursor-pointer">
                                {item.productName}
                              </Label>
                            </div>
                            <Label className="text-muted-foreground">
                              {item.values
                                ? `Phân loại hàng ${item.values.join(" | ")}`
                                : ""}
                            </Label>
                            <Label>x{item.quantity}</Label>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mr-6">
                          <Label className="line-through text-muted-foreground">
                            {formatCurrency(item.price)}
                          </Label>
                          <Label>
                            {formatCurrency(item.price - item.discount)}
                          </Label>
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
                      <Label>
                        {order.note
                          ? `Ghi chú của bạn: ${order.note}`
                          : "(không có ghi chú)"}
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
                        <OrderReviewDialog order={order} toast={toast} />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="w-full min-h-[700px] flex flex-col justify-start m-2">
              <Image
                className="mx-auto"
                src={ReviewEmpty}
                width={400}
                height={400}
              ></Image>
              <Label className="text-xl text-gray-tertiary text-center m-2">
                Hiện tại bạn không có đơn hàng thuộc trạng thái này
              </Label>
            </div>
          )}
        </TabsContent>
        {orders.length > 0 ? (
          <PaginationAdminTable
            currentPage={currentPage}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            totalPage={totalPage}
            setCurrentPage={setCurrentPage}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
          ></PaginationAdminTable>
        ) : (
          ""
        )}
      </Tabs>
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
