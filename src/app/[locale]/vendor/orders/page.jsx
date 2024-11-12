"use client";

import { ArrowUpDown, CalendarCog, ListFilter } from "lucide-react";
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
  DropdownMenuLabel,
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
import { getAllOrder, updateOrderStatus } from "@/api/vendor/orderRequest";
import { Input } from "@/components/ui/input";
import { Search } from "@mui/icons-material";
import { useToast } from "@/hooks/use-toast";
import DialogUpdateOrderStatus from "./dialogUpdateOrderStatus";
import ViewOrderDetail from "./viewOrderDetail";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "@/store/features/orderSearchSlice";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [sortType, setSortType] = useState("newest");
  const [totalElement, setTotalElement] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const search = useSelector((state) => state.orderSearch.value);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogUpdateOrderStatusOpen, setIsDialogUpdateOrderStatusOpen] =
    useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [orderCode, setOrderCode] = useState(null);
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

  const handleSortChange = (type) => {
    setSortType(sortType === type ? "" : type);
  };

  const handleSearchChange = (searchKey) => {
    dispatch(setSearch(searchKey));
    setCurrentPage(1);
  };

  const dropdownItems = [
    { label: "Tất cả", key: "" },
    { label: "Chờ xác nhận", key: "CONFIRMING" },
    { label: "Chờ vận chuyển", key: "WAITING" },
    { label: "Đang vận chuyển", key: "SHIPPING" },
    { label: "Hoàn thành", key: "COMPLETED" },
    { label: "Đã hủy", key: "CANCELED" },
  ];

  const handleOnChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleRowClick = (orderId) => {
    setIsDrawerOpen(true);
    setSelectedOrder(orderId);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleUpdateButtonClick = (order, orderId, orderCode) => {
    setIsDialogUpdateOrderStatusOpen(true);
    setOrderToUpdate(order);
    setSelectedOrder(orderId);
    setOrderCode(orderCode);
  };

  const confirmUpdateOrderStatus = async () => {
    if (orderToUpdate) {
      try {
        await updateOrderStatus(orderToUpdate.id);
        toast({
          title: "Thành công",
          description: `Đơn hàng "${orderToUpdate.code}" đã được cập nhật trạng thái thành công`,
        });
        fetchAllOrder();
        setIsDialogUpdateOrderStatusOpen(false);
      } catch (error) {
        toast({
          title: "Thất bại",
          description: `Đơn hàng "${orderToUpdate.code}" đã được cập nhật trạng thái thất bại`,
          variant: "destructive",
        });
      }
    }
  };

  const fetchAllOrder = useCallback(async () => {
    try {
      const response = await getAllOrder(currentPage, sortType, search);
      console.log("All order of store: ", response);
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
  }, [toast, currentPage, sortType, search]);

  useEffect(() => {
    fetchAllOrder();
  }, [fetchAllOrder, totalPage, totalElement]);

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
      case "CONFIRMING":
        return "Chờ xác nhận";
      case "WAITING":
        return "Chờ vận chuyển";
      case "SHIPPING":
        return "Đang vận chuyển";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELED":
        return "Đã hủy";
      case "NA":
        return "N/A";
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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Toaster />
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
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
                <DropdownMenuLabel>Sắp xếp theo</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  onClick={() => handleSortChange("newest")}
                  checked={sortType === "newest"}
                >
                  Mới nhất
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  onClick={() => handleSortChange("oldest")}
                  checked={sortType === "oldest"}
                >
                  Cũ nhất
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                    key={item.key}
                    onClick={() => handleSearchChange(item.key)}
                    checked={search === item.key}
                  >
                    {item.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Danh sách đơn hàng ({totalElement})</CardTitle>
              <CardDescription>
                Quản lý tất cả đơn hàng trong cửa hàng
              </CardDescription>
              <div className="ml-auto flex items-center gap-2">
                <Input onChange={(e) => handleOnChange(e.target.value)}></Input>
                <Search className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Đơn hàng</TableHead>
                    <TableHead>Ngày đặt hàng</TableHead>
                    <TableHead>Thanh toán</TableHead>
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
                      <TableCell className="font-medium">
                        {order.code}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatDate(order.lastUpdatedAt)}
                      </TableCell>
                      <TableCell className="font-medium">
                        <Badge variant="outline">Chưa thanh toán</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <Badge variant="outline">
                          {getStatusOrder(order ? order.currentStatus : "NA")}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(order.grandTotal)}
                      </TableCell>
                      <TableCell className="md:table-cell">
                        {order.currentStatus === "CONFIRMING" ||
                        order.currentStatus === "WAITING" ? (
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateButtonClick(
                                order,
                                order.id,
                                order.code
                              );
                            }}
                          >
                            <CalendarCog className="h-4 w-4" />
                          </Button>
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
      </div>
      {isDrawerOpen && (
        <ViewOrderDetail
          isOpen={isDrawerOpen}
          onClose={() => handleCloseDrawer()}
          orderId={selectedOrder}
        />
      )}
      {isDialogUpdateOrderStatusOpen && (
        <DialogUpdateOrderStatus
          isOpen={isDialogUpdateOrderStatusOpen}
          onClose={() => setIsDialogUpdateOrderStatusOpen(false)}
          onUpdateOrderStatus={confirmUpdateOrderStatus}
          orderCode={orderCode}
        />
      )}
    </div>
  );
}
