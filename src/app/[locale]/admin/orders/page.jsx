"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import {
  ArrowUpDown,
  ListFilter,
  Pencil,
  CircleOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PaginationAdminTable } from "@/components/paginations/pagination";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getAllOrderByAdmin,
  cancelListOrderByAdmin,
  cancelOneOrderByAdmin,
  updateListOrderByAdmin,
  updateOneOrderByAdmin,
} from "@/api/admin/orderRequest";
import { useSelector } from "react-redux";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import ReviewEmpty from "@/assets/images/ReviewEmpty.png";
import { formatCurrency, formatDate } from "@/utils";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import DialogUpdateOrCancelOrder from "@/components/dialogs/dialogUpdateOrCancelOrder";
import { Checkbox } from "@/components/ui/checkbox";
import DialogConfirmListOrderAdmin from "@/components/dialogs/dialogConfirmListOrderAdmin";

export default function ManageOrderByAdmin() {
  const pageSize = 10;
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
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

  const [listOrderId, setListOrderId] = useState([]);
  const [isDialogListOpen, setIsDialogListOpen] = useState(false);
  const [selectedListOrder, setSelectedListOrder] = useState([]);

  const [isDefaultChecked, setIsDefaultChecked] = useState(true);
  const [isUpdateChecked, setIsUpdateChecked] = useState(false);
  const [isCancelChecked, setIsCancelChecked] = useState(false);

  const [selectedOrderIdSet, setSelectedOrderIdSet] = useState(new Set());
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

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
  const handleClickViewOrderDetail = (orderId) => {
    router.push(`orders/detail/${orderId}`);
  };

  const handleClickUpdateStatus = (order) => {
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

  const handleClickTabsTrigger = (value) => {
    setFilter(value);
    setFilterTab(value);
  };

  const confirmUpdate = async () => {
    if (orderToUpdate) {
      try {
        await updateOneOrderByAdmin(orderToUpdate.id);
        toast({
          description: `Đơn hàng "${orderToUpdate.id}" đã được cập nhật trạng thái`,
        });
        setIsDialogOpen(false);
        setSelectedOrder(null);
        setOrderToUpdate(null);
        setListOrderId([]);
        setSelectedListOrder([]);
        setSelectedOrderIdSet(new Set());
        setIsSelectAllChecked(false)
        fetchAllOrderByAdmin();
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
        await cancelOneOrderByAdmin(orderToCancel.id);
        toast({
          description: `Đơn hàng "${orderToCancel.id}" đã được hủy thành công`,
        });
        setIsDialogOpen(false);
        setOrderToCancel(null);
        setSelectedOrder(null);
        setListOrderId([]);
        setSelectedListOrder([]);
        setSelectedOrderIdSet(new Set());
        setIsSelectAllChecked(false)
        fetchAllOrderByAdmin();
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
    setOrders((prevOrders) =>
      prevOrders.map((order) => ({ ...order, isChecked: false }))
    );

    setSelectedOrderIdSet(new Set());
    setListOrderId([]);
    setSelectedListOrder([]);
    setIsSelectAllChecked(false);

    switch (type) {
      case "default":
        setIsDefaultChecked(true);
        setIsUpdateChecked(false);
        setIsCancelChecked(false);
        break;
      case "update":
        setIsDefaultChecked(false);
        setIsUpdateChecked(true);
        setIsCancelChecked(false);
        break;
      case "cancel":
        setIsDefaultChecked(false);
        setIsUpdateChecked(false);
        setIsCancelChecked(true);
        break;
      default:
        break;
    }
  };

  const handleCheckboxOrder = (order, isChecked) => {
    setSelectedOrderIdSet((prev) => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(order.id);
      } else {
        newSet.delete(order.id);
      }
      return newSet;
    });

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
      await cancelListOrderByAdmin(listOrderId);
      toast({
        description: `Đã hủy ${listOrderId.length} đơn hàng thành công`,
      });
      setListOrderId([]);
      setSelectedListOrder([]);
      setSelectedOrderIdSet(new Set());
      setIsSelectAllChecked(false)
      setIsDialogListOpen(false);
      fetchAllOrderByAdmin();
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
      await updateListOrderByAdmin(listOrderId);
      toast({
        description: `Đã cập nhật trạng thái ${listOrderId.length} đơn hàng thành công`,
      });
      setListOrderId([]);
      setSelectedListOrder([]);
      setSelectedOrderIdSet(new Set());
      setIsSelectAllChecked(false)
      setIsDialogListOpen(false);
      fetchAllOrderByAdmin();
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

  const findUpdatedOrders = (orders) => {
    const allowedStatuses = ["WAITING_FOR_SHIPPING", "PICKED_UP", "OUT_FOR_DELIVERY"]
    return orders.filter(order => allowedStatuses.includes(order.currentStatus))
  };

  const findCancelledOrders = (orders) => {
    const notAllowedStatuses = ["CANCELLED", "DELIVERED"]
    return orders.filter(order => !notAllowedStatuses.includes(order.currentStatus))
  };

  const handleSelectAll = (isChecked) => {
    console.log("isChecked: ", isChecked)
    console.log("currentPage: ", currentPage)
    console.log("isUpdateChecked: ", isUpdateChecked)
    console.log("orders: ", orders)

    setIsSelectAllChecked(isChecked)

    if (isUpdateChecked && isChecked) {
      const updatedOrders = findUpdatedOrders(orders)
      console.log("updatedOrders: ", updatedOrders)

      if (updatedOrders.length === 0) {
        setIsSelectAllChecked(false)
        toast({
          description: "Trang này không có đơn hàng để cập nhật",
          variant: "destructive",
        });
        return
      }

      const newOrders = updatedOrders.filter(
        (order) => !selectedOrderIdSet.has(order.id)
      );
      console.log("newOrders: ", newOrders)

      const newOrderIds = newOrders.map((order) => order.id)
      console.log("newOrderIds: ", newOrderIds)

      setListOrderId((prev) => [...prev, ...newOrderIds]);
      setSelectedListOrder((prev) => [...prev, ...newOrders]);
      setSelectedOrderIdSet((prev) => {
        const newSet = new Set(prev);
        newOrderIds.forEach((id) => newSet.add(id));
        return newSet;
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          newOrderIds.includes(order.id)
            ? { ...order, isChecked: true }
            : order
        )
      );
    }

    if (isCancelChecked && isChecked) {
      const cancelledOrders = findCancelledOrders(orders)
      console.log("cancelledOrders: ", cancelledOrders)

      if (cancelledOrders.length === 0) {
        setIsSelectAllChecked(false)
        toast({
          description: "Trang này không có đơn hàng để hủy",
          variant: "destructive",
        });
        return
      }

      const newOrders = cancelledOrders.filter(
        (order) => !selectedOrderIdSet.has(order.id)
      );
      console.log("newOrders: ", newOrders)

      const newOrderIds = newOrders.map((order) => order.id)
      console.log("newOrderIds: ", newOrderIds)

      setListOrderId((prev) => [...prev, ...newOrderIds]);
      setSelectedListOrder((prev) => [...prev, ...newOrders]);
      setSelectedOrderIdSet((prev) => {
        const newSet = new Set(prev);
        newOrderIds.forEach((id) => newSet.add(id));
        return newSet;
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          newOrderIds.includes(order.id)
            ? { ...order, isChecked: true }
            : order
        )
      );
    }

    if (isUpdateChecked && !isChecked) {
      const updatedOrders = findUpdatedOrders(orders)
      console.log("updatedOrders: ", updatedOrders)

      const updatedOrderIds = new Set(updatedOrders.map((order) => order.id));
      console.log("updatedOrderIds: ", updatedOrderIds)

      setSelectedListOrder((prev) =>
        prev.filter((order) => !updatedOrderIds.has(order.id))
      );

      setListOrderId((prev) =>
        prev.filter((id) => !updatedOrderIds.has(id))
      );

      setSelectedOrderIdSet((prev) => {
        const newSet = new Set(prev);
        updatedOrderIds.forEach((id) => newSet.delete(id));
        return newSet;
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          updatedOrderIds.has(order.id)
            ? { ...order, isChecked: false }
            : order
        )
      );
    }

    if (isCancelChecked && !isChecked) {
      const cancelledOrders = findCancelledOrders(orders)
      console.log("cancelledOrders: ", cancelledOrders)

      const cancelledOrderIds = new Set(cancelledOrders.map((order) => order.id));
      console.log("cancelledOrderIds: ", cancelledOrderIds)

      setSelectedListOrder((prev) =>
        prev.filter((order) => !cancelledOrderIds.has(order.id))
      );

      setListOrderId((prev) =>
        prev.filter((id) => !cancelledOrderIds.has(id))
      );

      setSelectedOrderIdSet((prev) => {
        const newSet = new Set(prev);
        cancelledOrderIds.forEach((id) => newSet.delete(id));
        return newSet;
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          cancelledOrderIds.has(order.id)
            ? { ...order, isChecked: false }
            : order
        )
      );
    }
  };

  const findOrdersOnlyIn = (updatedOrders, selectedListOrder) => {
    const selectedIds = new Set(selectedListOrder.map(order => order.id));
    const difference = updatedOrders.filter(order => !selectedIds.has(order.id));
    return difference;
  }

  useEffect(() => {
    console.log("currentPage: ", currentPage)
    console.log("orders: ", orders)
    console.log("isUpdateChecked: ", isUpdateChecked)
    console.log("isCancelChecked: ", isCancelChecked)

    if (isUpdateChecked) {
      const updatedOrders = findUpdatedOrders(orders)
      console.log("updatedOrders: ", updatedOrders)
      console.log("selectedListOrder: ", selectedListOrder)

      if (updatedOrders.length === 0) {
        setIsSelectAllChecked(false)
        return
      }

      const onlyInUpdated = findOrdersOnlyIn(updatedOrders, selectedListOrder)
      console.log("onlyInUpdated: ", onlyInUpdated)

      if (onlyInUpdated.length > 0) {
        const onlyInUpdatedIds = new Set(onlyInUpdated.map(order => order.id));

        const hasDiff =
          selectedListOrder.some(order => onlyInUpdatedIds.has(order.id)) ||
          listOrderId.some(id => onlyInUpdatedIds.has(id)) ||
          orders.some(order => onlyInUpdatedIds.has(order.id) && order.isChecked === true);

        if (hasDiff) {
          setSelectedOrderIdSet(prev => {
            const newSet = new Set(prev);
            onlyInUpdatedIds.forEach(id => newSet.delete(id));
            return newSet;
          });

          setSelectedListOrder(prev =>
            prev.filter(order => !onlyInUpdatedIds.has(order.id))
          );

          setListOrderId(prev =>
            prev.filter(id => !onlyInUpdatedIds.has(id))
          );

          setOrders(prevOrders =>
            prevOrders.map(order =>
              onlyInUpdatedIds.has(order.id)
                ? { ...order, isChecked: false }
                : order
            )
          );
        }
      }

      if (selectedListOrder.length === 0) {
        return
      }

      const isInclude = updatedOrders.every(updatedOrder =>
        selectedListOrder.some(selectedOrder => selectedOrder.id === updatedOrder.id)
      )
      console.log("isInclude: ", isInclude)
  
      if (isInclude) {
        setIsSelectAllChecked(true)
      } else {
        setIsSelectAllChecked(false)
      }
    }

    if (isCancelChecked) {
      const cancelledOrders = findCancelledOrders(orders)
      console.log("cancelledOrders: ", cancelledOrders)
      console.log("selectedListOrder: ", selectedListOrder)

      if (cancelledOrders.length === 0) {
        setIsSelectAllChecked(false)
        return
      }

      const onlyInCancelled = findOrdersOnlyIn(cancelledOrders, selectedListOrder)
      console.log("onlyInCancelled: ", onlyInCancelled)

      if (onlyInCancelled.length > 0) {
        const onlyInCancelledIds = new Set(onlyInCancelled.map(order => order.id));

        const hasDiff =
          selectedListOrder.some(order => onlyInCancelledIds.has(order.id)) ||
          listOrderId.some(id => onlyInCancelledIds.has(id)) ||
          orders.some(order => onlyInCancelledIds.has(order.id) && order.isChecked === true);

        if (hasDiff) {
          setSelectedOrderIdSet(prev => {
            const newSet = new Set(prev);
            onlyInCancelledIds.forEach(id => newSet.delete(id));
            return newSet;
          });

          setSelectedListOrder(prev =>
            prev.filter(order => !onlyInCancelledIds.has(order.id))
          );

          setListOrderId(prev =>
            prev.filter(id => !onlyInCancelledIds.has(id))
          );

          setOrders(prevOrders =>
            prevOrders.map(order =>
              onlyInCancelledIds.has(order.id)
                ? { ...order, isChecked: false }
                : order
            )
          );
        }
      }
        
      if (selectedListOrder.length === 0) {
        return
      }
      
      const isInclude = cancelledOrders.every(cancelledOrder =>
        selectedListOrder.some(selectedOrder => selectedOrder.id === cancelledOrder.id)
      )
      console.log("isInclude: ", isInclude)
  
      if (isInclude) {
        setIsSelectAllChecked(true)
      } else {
        setIsSelectAllChecked(false)
      }
    }
  }, [currentPage, orders])

  useEffect(() => {
    console.log("isSelectAllChecked: ", isSelectAllChecked)
  }, [isSelectAllChecked])

  useEffect(() => {
    console.log("listOrderId: ", listOrderId)
  }, [listOrderId])

  useEffect(() => {
    console.log("selectedListOrder: ", selectedListOrder)
  }, [selectedListOrder])

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
      setOrders(
        response.result.data.map((order) => ({
          ...order,
          isChecked: selectedOrderIdSet.has(order.id),
        }))
      );
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

  return (
    <>
      <Toaster />
      <Tabs value={filter} className="min-h-screen rounded-lg px-8 py-4 mb-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between space-x-8">
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
                <Label className="text-sm text-center">Cập nhật (nhiều)</Label>
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
                  <Button variant="outline" className="space-x-1">
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
                  <Button variant="outline" className="space-x-1">
                    <ListFilter className="h-4 w-4" />
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
          <TabsList className="w-full h-auto flex flex-wrap items-start justify-start gap-2">
            {listOrderStatus.map((item) => (
              <TabsTrigger
                key={item.filterKey}
                value={item.filterKey}
                onClick={() => handleClickTabsTrigger(item.filterKey)}
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value={filter} className="py-4">
          {orders.length > 0 && (
            <Card>
              <div className="flex items-center justify-between space-x-8 px-8 py-4 border-b">
                <div className="flex flex-col space-y-2">
                  <CardTitle>
                    Danh sách tất cả đơn hàng ({totalElement})
                  </CardTitle>
                  <CardDescription>
                    Quản lý tất cả đơn hàng có trên hệ thống
                  </CardDescription>
                </div>
                {/* Button cập nhật nhiều */}
                {isUpdateChecked && (
                  <Button
                    className="flex items-center space-x-2"
                    onClick={handleClickButtonUpdateList}
                  >
                    <Label className="text-sm text-center hover:cursor-pointer">
                      Cập nhật
                    </Label>
                    <Pencil className="h-6 w-6" />
                  </Button>
                )}
                {/* Button hủy nhiều */}
                {isCancelChecked && (
                  <Button
                    className="flex items-center space-x-2"
                    onClick={handleClickButtonCancelList}
                  >
                    <Label className="text-sm text-center hover:cursor-pointer">
                      Hủy
                    </Label>
                    <CircleOff className="h-6 w-6" />
                  </Button>
                )}
              </div>
              <CardContent className="min-h-[600px] mt-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {
                        (isUpdateChecked || isCancelChecked) && (
                          <TableHead className="dark:text-gray-primary">
                            <Checkbox
                              onCheckedChange={(checked) => handleSelectAll(checked)}
                              checked={isSelectAllChecked}
                            />
                          </TableHead>
                      )}
                      <TableHead className="dark:text-gray-primary">
                        Mã đơn hàng
                      </TableHead>
                      <TableHead className="dark:text-gray-primary">
                        Ngày đặt hàng
                      </TableHead>
                      <TableHead className="hidden sm:table-cell dark:text-gray-primary">
                        Số điện thoại
                      </TableHead>
                      <TableHead className="hidden sm:table-cell dark:text-gray-primary">
                        Địa chỉ
                      </TableHead>
                      <TableHead className="hidden sm:table-cell dark:text-gray-primary">
                        Thanh toán
                      </TableHead>
                      <TableHead className="hidden sm:table-cell dark:text-gray-primary">
                        Phương thức
                      </TableHead>
                      <TableHead className="dark:text-gray-primary">
                        Tổng tiền
                      </TableHead>
                      <TableHead className="dark:text-gray-primary">
                        Trạng thái
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow
                        key={order.id}
                        onClick={() => handleClickViewOrderDetail(order.id)}
                        className="h-[65px] hover:cursor-pointer"
                      >
                        {
                          (isUpdateChecked || isCancelChecked) && (
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
                                (order.currentStatus === "WAITING_FOR_SHIPPING" ||
                                  order.currentStatus === "PICKED_UP" ||
                                  order.currentStatus === "OUT_FOR_DELIVERY") && (
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
                                order.currentStatus !== "DELIVERED" &&
                                order.currentStatus !== "CANCELLED" && (
                                  <Checkbox
                                    className="m-4"
                                    checked={order.isChecked || false}
                                    onCheckedChange={(checked) =>
                                      handleCheckboxOrder(order, checked)
                                    }
                                  />
                              )}
                            </TableCell>
                        )}
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
                          {formatCurrency(order.grandTotal)}
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          <div className="w-fit h-fit flex lg:flex-row flex-col items-center justify-center gap-2 mx-auto">
                            <Button variant="outline" className="w-fit cursor-default">
                              {getCurrentStatusOrder(order.currentStatus)}
                            </Button>
                            <div className="flex flex-row justify-center items-center gap-2">
                              {(order.currentStatus === "WAITING_FOR_SHIPPING" ||
                                order.currentStatus === "PICKED_UP" ||
                                order.currentStatus === "OUT_FOR_DELIVERY") && (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleClickUpdateStatus(order);
                                  }}
                                  className="w-fit mx-auto"
                                >
                                  <Pencil className="w-5 h-5" />
                                </Button>
                              )}
                              {order.currentStatus !== "DELIVERED" &&
                                order.currentStatus !== "CANCELLED" && (
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleClickButtonCancel(order);
                                    }}
                                    className="w-fit mx-auto"
                                  >
                                    <CircleOff className="w-5 h-5" />
                                  </Button>
                                )}
                            </div>
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
        </TabsContent>
      </Tabs>
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
          <DialogConfirmListOrderAdmin
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
