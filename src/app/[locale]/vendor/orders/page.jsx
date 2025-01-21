"use client";

import {
  ArrowUpDown,
  Ban,
  CalendarCog,
  Check,
  ListFilter,
  SquareX,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  cancelListOrderBySeller,
  cancelOneOrderBySeller,
  getAllOrderBySeller,
  updateListOrderBySeller,
  updateOneOrderBySeller,
} from "@/api/vendor/orderRequest";
import { Input } from "@/components/ui/input";
import {
  EditCalendar,
  EventAvailable,
  EventBusy,
  Search,
} from "@mui/icons-material";
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
import { Checkbox } from "@/components/ui/checkbox";
import DialogConfirmListOrderSeller from "@/components/dialogs/dialogConfirmListOrderSeller";

export default function ManageOrderBySeller() {
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

  const [listOrderId, setListOrderId] = useState([]);
  const [isDialogListOpen, setIsDialogListOpen] = useState(false);
  const [selectedListOrder, setSelectedListOrder] = useState([]);

  const [isDefaultChecked, setIsDefaultChecked] = useState(true);
  const [isUpdateChecked, setIsUpdateChecked] = useState(false);
  const [isCancelChecked, setIsCancelChecked] = useState(false);

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

  const handleClickButtonUpdate = (order) => {
    setIsDialogOpen(true);
    setOrderToUpdate(order);
    setSelectedOrder(order);
    setActionType("update");
  };

  const handleClickButtonCancel = (order) => {
    setIsDialogOpen(true);
    setOrderToCancel(order);
    setSelectedOrder(order);
    setActionType("cancel");
  };

  const router = useRouter();
  const handleClickViewOrderDetail = (orderId) => {
    router.push(`orders/detail/${orderId}`);
  };

  const confirmUpdate = async () => {
    if (orderToUpdate) {
      try {
        await updateOneOrderBySeller(orderToUpdate.id);
        toast({
          description: `Đơn hàng "${orderToUpdate.id}" đã được cập nhật trạng thái`,
        });
        setIsDialogOpen(false);
        setOrderToUpdate(null);
        setSelectedOrder(null);
        fetchAllOrderBySeller();
      } catch (error) {
        toast({
          title: "Thất bại",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const confirmCancel = async () => {
    if (orderToCancel) {
      try {
        await cancelOneOrderBySeller(orderToCancel.id);
        toast({
          description: `Đơn hàng "${orderToCancel.id}" đã được hủy thành công`,
        });
        setIsDialogOpen(false);
        setOrderToCancel(null);
        setSelectedOrder(null);
        fetchAllOrderBySeller();
      } catch (error) {
        toast({
          title: "Thất bại",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleCheckboxOption = (type) => {
    switch (type) {
      case "default":
        setIsDefaultChecked(true);
        setIsUpdateChecked(false);
        setIsCancelChecked(false);
        setListOrderId([]);
        setSelectedListOrder([]);
        break;
      case "update":
        setIsDefaultChecked(false);
        setIsUpdateChecked(true);
        setIsCancelChecked(false);
        setListOrderId([]);
        setSelectedListOrder([]);
        break;
      case "cancel":
        setIsDefaultChecked(false);
        setIsUpdateChecked(false);
        setIsCancelChecked(true);
        setListOrderId([]);
        setSelectedListOrder([]);
        break;
      default:
        break;
    }
  };

  const handleCheckboxOrder = (order, isChecked) => {
    setListOrderId((prev) => {
      if (isChecked) {
        return [...prev, order.id];
      } else {
        return prev.filter((id) => id !== order.id);
      }
    });

    setSelectedListOrder((prev) => {
      if (isChecked) {
        return [...prev, order];
      } else {
        return prev.filter((selectedOrder) => selectedOrder.id !== order.id);
      }
    });

    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === order.id ? { ...o, isChecked: isChecked } : o
      )
    );
  };

  const handleClickButtonCancelList = () => {
    if (listOrderId.length === 0) {
      toast({
        title: "Thất bại",
        description: "Vui lòng chọn ít nhất một đơn hàng để hủy",
        variant: "destructive",
      });
      return;
    }
    setIsDialogListOpen(true);
    setActionType("cancel");
  };

  const handleClickButtonUpdateList = () => {
    if (listOrderId.length === 0) {
      toast({
        title: "Thất bại",
        description:
          "Vui lòng chọn ít nhất một đơn hàng để cập nhật trạng thái",
        variant: "destructive",
      });
      return;
    }
    setIsDialogListOpen(true);
    setActionType("update");
  };

  const confirmCancelList = async () => {
    try {
      await cancelListOrderBySeller(listOrderId);
      toast({
        description: `Đã hủy ${listOrderId.length} đơn hàng thành công`,
      });
      setListOrderId([]);
      setSelectedListOrder([]);
      setIsDialogListOpen(false);
      fetchAllOrderBySeller();
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const confirmUpdateList = async () => {
    try {
      await updateListOrderBySeller(listOrderId);
      toast({
        description: `Đã cập nhật trạng thái ${listOrderId.length} đơn hàng thành công`,
      });
      setListOrderId([]);
      setSelectedListOrder([]);
      setIsDialogListOpen(false);
      fetchAllOrderBySeller();
    } catch (error) {
      toast({
        title: "Thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveOrder = (orderId) => {
    setListOrderId((prev) => prev.filter((id) => id !== orderId));

    setSelectedListOrder((prev) => {
      const updatedList = prev.filter((order) => order.id !== orderId);
      if (updatedList.length === 0) {
        setIsDialogListOpen(false);
      }
      return updatedList;
    });

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, isChecked: false } : order
      )
    );
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

  const listOrderStatus = [
    { label: "Tất cả", filterKey: "", activeKey: "all" },
    { label: "Chờ thanh toán", filterKey: "ON_HOLD", activeKey: "onHold" },
    { label: "Chờ xác nhận", filterKey: "PENDING", activeKey: "pending" },
    { label: "Đã xác nhận", filterKey: "CONFIRMED", activeKey: "confirmed" },
    { label: "Chuẩn bị hàng", filterKey: "PREPARING", activeKey: "preparing" },
    {
      label: "Chờ giao cho ĐVVC",
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

  function getCurrentStatus(status) {
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

  return (
    <>
      <Toaster />
      <div className="min-h-screen pt-20 pl-6 pr-6">
        {orders.length > 0 && (
          <div className="flex flex-col space-y-6 mb-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center border-2 p-2 rounded-lg space-x-2`}
                  >
                    <Label className="text-sm text-center">Mặc định</Label>
                    {/*Checkbox Mặc định */}
                    <Checkbox
                      checked={isDefaultChecked}
                      onCheckedChange={() => handleCheckboxOption("default")}
                    />
                  </div>
                  <div
                    className={`flex items-center border-2 p-2 rounded-lg space-x-2`}
                  >
                    <Label className="text-sm text-center">
                      Cập nhật (nhiều)
                    </Label>
                    {/*Checkbox Cập nhật (nhiều) */}
                    <Checkbox
                      checked={isUpdateChecked}
                      onCheckedChange={() => handleCheckboxOption("update")}
                    />
                  </div>
                  <div
                    className={`flex items-center border-2 p-2 rounded-lg space-x-2`}
                  >
                    <Label className="text-sm text-center">Hủy (nhiều)</Label>
                    {/*Checkbox Hủy (nhiều) */}
                    <Checkbox
                      checked={isCancelChecked}
                      onCheckedChange={() => handleCheckboxOption("cancel")}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="space-x-1">
                        <ArrowUpDown className="h-4 w-4" />
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
                      <Button variant="outline" size="sm" className="space-x-1">
                        <ListFilter className="h-4 w-4" />
                        <Label className="truncate sr-only sm:not-sr-only hover:cursor-pointer">
                          Lọc
                        </Label>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Lọc theo trạng thái</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {listOrderStatus.map((item, index) => (
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
              <div className="w-full flex items-center relative">
                <Search className="absolute left-2.5 top-2.5 h-5 w-5 hover:cursor-pointer" />
                <Input
                  onChange={(e) => handleOnChange(e.target.value)}
                  placeholder="Tìm kiếm đơn hàng theo mã đơn hàng"
                  className="pl-8"
                />
              </div>
            </div>
            <Card>
              <div className="flex items-center justify-between space-x-8 px-8 py-4 border-b">
                <div className="flex flex-col space-y-2">
                  <CardTitle>
                    Danh sách tất cả đơn hàng ({totalElement})
                  </CardTitle>
                  <CardDescription>
                    Quản lý tất cả đơn hàng có trong cửa hàng
                  </CardDescription>
                </div>
                {/* Button cập nhật nhiều */}
                {isUpdateChecked && (
                  <Button
                    className="flex items-center space-x-2"
                    variant="outline"
                    onClick={handleClickButtonUpdateList}
                  >
                    <Label className="text-sm text-center hover:cursor-pointer">
                      Cập nhật
                    </Label>
                    <EditCalendar className="h-6 w-6" />
                  </Button>
                )}
                {/* Button hủy nhiều */}
                {isCancelChecked && (
                  <Button
                    className="flex items-center space-x-2"
                    variant="outline"
                    onClick={handleClickButtonCancelList}
                  >
                    <Label className="text-sm text-center hover:cursor-pointer">
                      Hủy
                    </Label>
                    <EventBusy className="h-6 w-6" />
                  </Button>
                )}
              </div>
              <CardContent className="min-h-[600px] mt-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="dark:text-gray-primary"></TableHead>
                      <TableHead className="dark:text-gray-primary">
                        Mã đơn hàng
                      </TableHead>
                      <TableHead className="dark:text-gray-primary">
                        Ngày đặt hàng
                      </TableHead>
                      <TableHead className="dark:text-gray-primary">
                        Trạng thái
                      </TableHead>
                      <TableHead className="dark:text-gray-primary">
                        Tổng tiền
                      </TableHead>
                      <TableHead className="dark:text-gray-primary"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow
                        key={order.id}
                        onClick={() => handleClickViewOrderDetail(order.id)}
                        className="h-[65px] hover:cursor-pointer"
                      >
                        <TableCell
                          className="font-medium text-center min-w-16"
                          onClick={(e) => {
                            if (isUpdateChecked || isCancelChecked) {
                              e.stopPropagation();
                            }
                          }}
                        >
                          {/*Checkbox cập nhật nhiều Order */}
                          {isUpdateChecked &&
                            (order.currentStatus === "PENDING" ||
                              order.currentStatus === "CONFIRMED" ||
                              order.currentStatus === "PREPARING") && (
                              <Checkbox
                                className="m-4"
                                checked={order.isChecked || false}
                                onCheckedChange={(checked) =>
                                  handleCheckboxOrder(order, checked)
                                }
                              />
                            )}
                          {/*Checkbox hủy nhiều Order */}
                          {isCancelChecked &&
                            (order.currentStatus === "ON_HOLD" ||
                              order.currentStatus === "PENDING" ||
                              order.currentStatus === "CONFIRMED" ||
                              order.currentStatus === "PREPARING") && (
                              <Checkbox
                                className="m-4"
                                checked={order.isChecked || false}
                                onCheckedChange={(checked) =>
                                  handleCheckboxOrder(order, checked)
                                }
                              />
                            )}
                          {isDefaultChecked && (
                            <div className="w-full flex justify-center">
                              <Ban className="h-6 w-6 text-error-dark" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          {order.id}
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          <Badge variant="outline">
                            {getCurrentStatus(order.currentStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          {formatCurrency(order.total - order.discount)}
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          <div className="min-w-16 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
                            {(order.currentStatus === "PENDING" ||
                              order.currentStatus === "CONFIRMED" ||
                              order.currentStatus === "PREPARING") && (
                              <Button
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClickButtonUpdate(order);
                                }}
                                className="w-full sm:w-auto"
                              >
                                <EditCalendar />
                              </Button>
                            )}
                            {(order.currentStatus === "ON_HOLD" ||
                              order.currentStatus === "PENDING" ||
                              order.currentStatus === "CONFIRMED" ||
                              order.currentStatus === "PREPARING") && (
                              <Button
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClickButtonCancel(order);
                                }}
                                className="w-full sm:w-auto"
                              >
                                <EventBusy />
                              </Button>
                            )}
                            {order.currentStatus === "DELIVERED" && (
                              <Check className="w-full sm:w-auto" />
                            )}
                            {order.currentStatus === "CANCELLED" && (
                              <X className="w-full sm:w-auto" />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <PaginationAdminTable
                  currentPage={currentPage}
                  handleNextPage={handleNextPage}
                  handlePrevPage={handlePrevPage}
                  totalPage={totalPage}
                  setCurrentPage={setCurrentPage}
                  hasNext={hasNext}
                  hasPrevious={hasPrevious}
                />
              </CardFooter>
            </Card>
          </div>
        )}
        {orders.length === 0 && (
          <div className="min-h-screen flex flex-col items-center justify-center space-y-4 border-2 rounded-lg">
            <Image
              alt="ảnh trống"
              src={ReviewEmpty}
              width={200}
              height={200}
              unoptimized={true}
              priority
            />
            <Label className="text-xl text-center text-gray-tertiary">
              Hiện tại không có đơn hàng nào thuộc trạng thái này
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
            onUpdateOrderStatus={confirmUpdate}
            onCancelOrder={confirmCancel}
            selectedOrder={selectedOrder}
            actionType={actionType}
          />
        </>
      )}
      {isDialogListOpen && (
        <>
          <div className="fixed inset-0 bg-black-primary bg-opacity-85 z-[150]" />
          <DialogConfirmListOrderSeller
            onOpen={isDialogListOpen}
            onClose={() => setIsDialogListOpen(false)}
            onUpdateListOrder={confirmUpdateList}
            onCancelListOrder={confirmCancelList}
            selectedListOrder={selectedListOrder}
            onRemoveOrder={handleRemoveOrder}
            actionType={actionType}
          />
        </>
      )}
      {isLoading && (
        <div className="fixed inset-0 flex flex-col justify-center items-center z-[500] space-y-4 bg-black-secondary">
          <CircularProgress></CircularProgress>
          <p className="text-2xl text-white-primary">Đang tải dữ liệu...</p>
        </div>
      )}
    </>
  );
}
