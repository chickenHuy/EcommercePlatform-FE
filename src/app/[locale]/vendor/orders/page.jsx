"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import {
  setActiveItem,
  setFilter,
  setFilterTab,
} from "@/store/features/orderFilterSlice";

import {
  cancelListOrderBySeller,
  cancelOneOrderBySeller,
  getAllOrderBySeller,
  updateListOrderBySeller,
  updateOneOrderBySeller,
} from "@/api/vendor/orderRequest";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Toaster } from "@/components/ui/toaster";

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

import {
  ArrowUpDown,
  CircleOff,
  ListFilter,
  Pencil,
  Search,
} from "lucide-react";

import DialogUpdateOrCancelOrder from "@/components/dialogs/dialogUpdateOrCancelOrder";
import DialogConfirmListOrderSeller from "@/components/dialogs/dialogConfirmListOrderSeller";

import { PaginationAdminTable } from "@/components/paginations/pagination";
import Loading from "@/components/loading";
import { useToast } from "@/hooks/use-toast";

import { formatCurrency, formatDate } from "@/utils";
import Image from "next/image";
import ReviewEmpty from "@/assets/images/ReviewEmpty.png";
import { useTranslations } from "next-intl";

export default function ManageOrderBySeller() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const pageSize = 10;
  const [orders, setOrders] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalElement, setTotalElement] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const [sortBy, setSortBy] = useState("createdAt");
  const [orderBy, setOrderBy] = useState("desc");
  const [search, setSearch] = useState("");

  const filterTab = useSelector((state) => state.orderFilterReducer.filterTab);
  const filter = useSelector((state) => state.orderFilterReducer.filter);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [listOrderId, setListOrderId] = useState([]);
  const [selectedListOrder, setSelectedListOrder] = useState([]);
  const [isDialogListOpen, setIsDialogListOpen] = useState(false);

  const [isDefaultChecked, setIsDefaultChecked] = useState(true);
  const [isUpdateChecked, setIsUpdateChecked] = useState(false);
  const [isCancelChecked, setIsCancelChecked] = useState(false);

  const t = useTranslations("Vendor.order");

  const handleNextPage = () => {
    if (currentPage < totalPage) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleSortChange = setSortBy;
  const handleOrderChange = setOrderBy;

  const handleFilterChange = (value, activeKey) => {
    dispatch(setFilterTab(value));
    dispatch(setFilter(value));
    dispatch(setActiveItem(activeKey));
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const openDialogForAction = (order, type) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
    setActionType(type);
    type === "update" ? setOrderToUpdate(order) : setOrderToCancel(order);
  };

  const handleClickButtonUpdate = (order) =>
    openDialogForAction(order, "update");
  const handleClickButtonCancel = (order) =>
    openDialogForAction(order, "cancel");

  const handleClickViewOrderDetail = (orderId) => {
    router.push(`orders/detail/${orderId}`);
  };

  const confirmUpdate = async () => {
    if (!orderToUpdate) return;
    try {
      await updateOneOrderBySeller(orderToUpdate.id);
      toast({
        title: t("notify"),
        description: t("updated_notify", { orderId: orderToUpdate.id }),
      });
      resetSingleAction();
      fetchAllOrderBySeller();
    } catch (error) {
      showErrorToast(error);
    }
  };

  const confirmCancel = async () => {
    if (!orderToCancel) return;
    try {
      await cancelOneOrderBySeller(orderToCancel.id);
      toast({
        title: t("notify"),
        description: t("cancelled_notify", { orderId: orderToUpdate.id }),
      });
      resetSingleAction();
      fetchAllOrderBySeller();
    } catch (error) {
      showErrorToast(error);
    }
  };

  const resetSingleAction = () => {
    setIsDialogOpen(false);
    setOrderToUpdate(null);
    setOrderToCancel(null);
    setSelectedOrder(null);
    setListOrderId([]);
    setSelectedListOrder([]);
  };

  const showErrorToast = (error) => {
    toast({
      title: t("notify"),
      description: error.message,
      variant: "destructive",
    });
  };

  const handleCheckboxOption = (type) => {
    setIsDefaultChecked(type === "default");
    setIsUpdateChecked(type === "update");
    setIsCancelChecked(type === "cancel");
  };

  const handleCheckboxOrder = (order, isChecked) => {
    setListOrderId((prev) =>
      isChecked ? [...prev, order.id] : prev.filter((id) => id !== order.id),
    );
    setSelectedListOrder((prev) =>
      isChecked ? [...prev, order] : prev.filter((o) => o.id !== order.id),
    );
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, isChecked } : o)),
    );
  };

  const handleClickButtonCancelList = () => {
    if (listOrderId.length === 0) return showEmptyListToast(t("cancel"));
    setIsDialogListOpen(true);
    setActionType("cancel");
  };

  const handleClickButtonUpdateList = () => {
    if (listOrderId.length === 0) return showEmptyListToast(t("update"));
    setIsDialogListOpen(true);
    setActionType("update");
  };

  const showEmptyListToast = (actionName) =>
    toast({
      title: "Thất bại",
      description: t("not_select_order", { actionName: actionName }),
      variant: "destructive",
    });

  const confirmCancelList = async () => {
    try {
      await cancelListOrderBySeller(listOrderId);
      toast({
        description: t("list_cancelled_notify", {
          orderId: listOrderId.length,
        }),
      });
      resetBatchAction();
      fetchAllOrderBySeller();
    } catch (error) {
      showErrorToast(error);
    }
  };

  const confirmUpdateList = async () => {
    try {
      await updateListOrderBySeller(listOrderId);
      toast({
        description: t("list_updated_notify", { orderId: listOrderId.length }),
      });
      resetBatchAction();
      fetchAllOrderBySeller();
    } catch (error) {
      showErrorToast(error);
    }
  };

  const resetBatchAction = () => {
    setListOrderId([]);
    setSelectedListOrder([]);
    setIsDialogListOpen(false);
  };

  const handleRemoveOrder = (orderId) => {
    setListOrderId((prev) => prev.filter((id) => id !== orderId));
    setSelectedListOrder((prev) => {
      const updated = prev.filter((order) => order.id !== orderId);
      if (updated.length === 0) setIsDialogListOpen(false);
      return updated;
    });
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, isChecked: false } : order,
      ),
    );
  };

  const fetchAllOrderBySeller = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllOrderBySeller(
        currentPage,
        pageSize,
        sortBy,
        orderBy,
        search,
        filterTab,
      );
      const { data, totalPages, totalElements, hasNext, hasPrevious } =
        response.result;
      setOrders(data);
      setTotalPage(totalPages);
      setTotalElement(totalElements);
      setHasNext(hasNext);
      setHasPrevious(hasPrevious);
    } catch (error) {
      console.error(error);
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
    { label: t("all_order"), filterKey: "", activeKey: "all" },
    {
      label: t("waiting_for_payment"),
      filterKey: "ON_HOLD",
      activeKey: "onHold",
    },
    {
      label: t("waiting_for_confirmation"),
      filterKey: "PENDING",
      activeKey: "pending",
    },
    { label: t("confirmed"), filterKey: "CONFIRMED", activeKey: "confirmed" },
    { label: t("preparing"), filterKey: "PREPARING", activeKey: "preparing" },
    {
      label: t("waiting_for_shipping"),
      filterKey: "WAITING_FOR_SHIPPING",
      activeKey: "waitingForShipping",
    },
    {
      label: t("delivered_to_the_carrier"),
      filterKey: "PICKED_UP",
      activeKey: "pickedUp",
    },
    {
      label: t("on_delivery"),
      filterKey: "OUT_FOR_DELIVERY",
      activeKey: "outForDelivery",
    },
    { label: t("completed"), filterKey: "DELIVERED", activeKey: "delivered" },
    { label: t("cancelled"), filterKey: "CANCELLED", activeKey: "cancelled" },
  ];

  function getCurrentStatus(status) {
    switch (status) {
      case "ON_HOLD":
        return t("waiting_for_payment");
      case "PENDING":
        return t("waiting_for_confirmation");
      case "CONFIRMED":
        return t("confirmed");
      case "PREPARING":
        return t("preparing");
      case "WAITING_FOR_SHIPPING":
        return t("waiting_for_shipping");
      case "PICKED_UP":
        return t("delivered_to_the_carrier");
      case "OUT_FOR_DELIVERY":
        return t("on_delivery");
      case "DELIVERED":
        return t("completed");
      case "CANCELLED":
        return t("cancelled");
    }
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen min-w-[900px] pt-20 lg:px-6 px-3">
        {orders && orders.length > 0 && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 p-2 border rounded-md">
                    <span className="text-[.9em]">{t("default")}</span>
                    <Checkbox
                      checked={isDefaultChecked}
                      onCheckedChange={() => handleCheckboxOption("default")}
                    />
                  </div>
                  <div className="flex items-center gap-3 p-2 border rounded-md">
                    <span className="text-[.9em]">{t("update_more")}</span>
                    <Checkbox
                      checked={isUpdateChecked}
                      onCheckedChange={() => handleCheckboxOption("update")}
                    />
                  </div>
                  <div className="flex items-center gap-3 p-2 border rounded-md">
                    <span className="text-[.9em]">{t("cancel_more")}</span>
                    <Checkbox
                      checked={isCancelChecked}
                      onCheckedChange={() => handleCheckboxOption("cancel")}
                    />
                  </div>
                </div>
                <div className="w-fit h-full flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-3">
                        <ArrowUpDown className="h-5 w-5" />
                        <span className="text-[1em]">{t("sort")}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t("sort")}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={sortBy}
                        onValueChange={(value) => handleSortChange(value)}
                      >
                        <DropdownMenuRadioItem value="id">
                          {t("order_code")}
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="createdAt">
                          {t("order_date")}
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={orderBy}
                        onValueChange={(value) => handleOrderChange(value)}
                      >
                        <DropdownMenuRadioItem value="desc">
                          {t("descreasing")}
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="asc">
                          {t("increasing")}
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSortBy("");
                          setOrderBy("");
                        }}
                      >
                        {t("unsort")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-3">
                        <ListFilter className="h-5 w-5" />
                        <span className="text-[1em]">{t("filter")}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t("filter_by_status")}</DropdownMenuLabel>
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
              <div className="w-full h-fit relative">
                <Search className="absolute top-0 right-3 translate-y-[5px]" />
                <Input
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t("find_by_order_code")}
                  className="px-2"
                />
              </div>
            </div>
            <Card>
              <div className="flex items-center justify-between gap-5 p-5 border-b">
                <div className="flex flex-col space-y-2">
                  <CardTitle>
                    {t("list_of_all_order", {total: totalElement})}
                  </CardTitle>
                  <CardDescription>
                    {t("manage_all_order_in_the_store")}
                  </CardDescription>
                </div>

                {/* Button cập nhật nhiều */}
                {isUpdateChecked && (
                  <Button
                    className="flex items-center justify-center gap-3"
                    onClick={handleClickButtonUpdateList}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="text-[1em]">{t("update")}</span>
                  </Button>
                )}

                {/* Button hủy nhiều */}
                {isCancelChecked && (
                  <Button
                    className="flex items-center justify-center gap-3"
                    onClick={handleClickButtonCancelList}
                  >
                    <span className="text-[1em]">{t("cancel")}</span>
                    <CircleOff className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CardContent className="min-h-[600px] p-3">
                {isLoading ? (
                  <Loading />
                ) : (
                  <Table className="overflow-auto">
                    <TableHeader>
                      <TableRow>
                        {(isUpdateChecked || isCancelChecked) && (
                          <TableHead></TableHead>
                        )}
                        <TableHead className="py-3">{t("order_code")}</TableHead>
                        <TableHead className="py-3">{t("order_date")}</TableHead>
                        <TableHead className="py-3">{t("total_amount")}</TableHead>
                        <TableHead className="py-3">{t("status")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders?.map((order) => (
                        <TableRow
                          key={order.id}
                          onClick={() => handleClickViewOrderDetail(order.id)}
                          className="cursor-pointer"
                        >
                          {(isUpdateChecked || isCancelChecked) && (
                            <TableCell
                              className="text-center w-fit"
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
                                    checked={order.isChecked || false}
                                    onCheckedChange={(checked) =>
                                      handleCheckboxOrder(order, checked)
                                    }
                                  />
                                )}
                            </TableCell>
                          )}
                          <TableCell className="text-center text-[1em]">
                            {order.id}
                          </TableCell>
                          <TableCell className="text-center text-[1em]">
                            {formatDate(order.createdAt)}
                          </TableCell>
                          <TableCell className="text-center text-[1em] font-[900]">
                            {formatCurrency(order.total - order.discount)}
                          </TableCell>
                          <TableCell className="text-center text-[1em]">
                            <div className="w-fit h-fit flex lg:flex-row flex-col items-center justify-center gap-2 mx-auto">
                              <Button
                                variant="outline"
                                className="w-fit cursor-default"
                              >
                                {getCurrentStatus(order.currentStatus)}
                              </Button>
                              <div className="flex flex-row justify-center items-center gap-2">
                                {(order.currentStatus === "PENDING" ||
                                  order.currentStatus === "CONFIRMED" ||
                                  order.currentStatus === "PREPARING") && (
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleClickButtonUpdate(order);
                                    }}
                                    className="w-fit mx-auto"
                                  >
                                    <Pencil className="w-5 h-5" />
                                  </Button>
                                )}
                                {(order.currentStatus === "ON_HOLD" ||
                                  order.currentStatus === "PENDING" ||
                                  order.currentStatus === "CONFIRMED" ||
                                  order.currentStatus === "PREPARING") && (
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
                )}
              </CardContent>
              <CardFooter className="p-3">
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
        {orders && orders.length === 0 && (
          <div className="min-h-screen flex flex-col items-center justify-start py-10">
            <Image
              alt="Empty Image"
              src={ReviewEmpty}
              width={400}
              height={400}
            />
            <span className="text-[1.1em] text-center text-gray-tertiary">
              {t("no_order")}
            </span>
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
    </>
  );
}
