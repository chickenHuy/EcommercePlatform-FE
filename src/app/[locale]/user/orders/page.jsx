"use client";

import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircularProgress, Rating } from "@mui/material";
import { CircleHelp, Forklift, Search } from "lucide-react";
import Image from "next/image";
import StoreEmpty from "@/assets/images/storeEmpty.jpg";
import ReviewEmpty from "@/assets/images/ReviewEmpty.png";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/utils";
import { OrderReviewDialog } from "@/components/dialogs/dialogReview";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect, useState } from "react";
import {
  cancelOrderByUser,
  getAllOrderByUser,
  isAllOrderReviewed,
  isAnyOrderReviewed,
} from "@/api/user/orderRequest";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import DialogUpdateOrCancelOrder from "@/components/dialogs/dialogUpdateOrCancelOrder";
import { setStore } from "@/store/features/userSearchSlice";
import { useInView } from "react-intersection-observer";
import { OrderViewReviewDialog } from "@/components/dialogs/dialogViewReview";
import { addToCart } from "@/api/cart/addToCart";
import { changeQuantity } from "@/store/features/cartSlice";

export default function OrderUser() {
  const pageSize = 4;
  const sortBy = "createdAt";
  const orderBy = "desc";
  const [nextPage, setNextPage] = useState(1);
  const [listOrder, setListOrder] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [orderCounts, setOrderCounts] = useState({});
  const router = useRouter();
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [openViewReview, setOpenViewReview] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState("");
  const [loadListOrder, setLoadListOrder] = useState(false);
  const [loadPage, setLoadPage] = useState(true);
  const { toast } = useToast();

  const { ref: loadRef, inView } = useInView();

  const handleFilter = (value) => {
    setFilter(value);
  };

  const handleSerach = (value) => {
    setSearch(value);
    setNextPage(1);
  };

  const handleOnClickViewOrderDetail = (orderId) => {
    router.push(`orders/detail/${orderId}`);
  };

  const handleClickViewProduct = (slug) => {
    router.push(`/${slug}`);
  };

  const handleClickViewShop = (storeId) => {
    router.push("/search");
    dispatch(setStore(storeId));
  };

  const oldQuantity = useSelector((state) => state.cartReducer.count);
  const handleClickRePurchase = async (listOrderItem) => {
    try {
      const listCartItemFromOrder = [];
      for (const orderItem of listOrderItem) {
        const request = {
          productId: orderItem.productId,
          variantId: orderItem.variantId,
          quantity: 1,
        };

        const response = await addToCart(request);
        listCartItemFromOrder.push(response.result);

        const newQuantity = oldQuantity + 1;
        dispatch(changeQuantity(newQuantity));
      }

      localStorage.setItem(
        "listCartItemFromOrder",
        JSON.stringify(listCartItemFromOrder)
      );
      router.push("/cart");
    } catch (error) {
      toast({
        title: "Mua lại thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClickCancel = (order) => {
    setOpenDialog(true);
    setOrderToCancel(order);
    setSelectedOrder(order);
    setActionType("cancel");
  };

  const handleClickReview = (order) => {
    setOpenReview(true);
    setSelectedOrder(order);
  };

  const handleClickViewReview = (order) => {
    setOpenViewReview(true);
    setSelectedOrder(order);
  };

  const confirmCancelOrder = async () => {
    if (orderToCancel) {
      try {
        await cancelOrderByUser(orderToCancel.id);
        toast({
          description: `Đơn hàng "${orderToCancel.id}" đã được hủy thành công`,
        });
        fetchAllOrderByUser(true);
        setOpenDialog(false);
      } catch (error) {
        toast({
          title: "Thất bại",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const fetchAllOrderByUser = useCallback(
    async (isInitialLoad = false) => {
      if (isInitialLoad) {
        setLoadPage(false);
      }

      setLoadListOrder(true);
      try {
        if (!isInitialLoad) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        const response = await getAllOrderByUser(
          isInitialLoad ? 1 : nextPage,
          pageSize,
          sortBy,
          orderBy,
          search,
          filter
        );

        const newListOrder = response.result.data;

        if (newListOrder.length === 0) {
          setListOrder(newListOrder);
          setNextPage(response.result.nextPage);
          setHasNext(response.result.hasNext);
        }

        if (newListOrder.length > 0) {
          setListOrder((prevListOrder) =>
            isInitialLoad ? newListOrder : [...prevListOrder, ...newListOrder]
          );
          setNextPage(response.result.nextPage);
          setHasNext(response.result.hasNext);
        }
      } catch (error) {
        console.error("Error fetching all order by user: ", error);
      } finally {
        setLoadListOrder(false);
      }
    },
    [nextPage, search, filter]
  );

  const fetchOrderCounts = useCallback(async () => {
    try {
      const response = await Promise.all(
        listOrderStatus.map((status) =>
          getAllOrderByUser(1, 1, sortBy, orderBy, "", status.filterKey)
        )
      );

      const counts = response.reduce((acc, res, index) => {
        acc[listOrderStatus[index].filterKey] = res.result.totalElements;
        return acc;
      }, {});

      setOrderCounts(counts);
    } catch (error) {
      console.error("Error fetching order counts:", error);
    }
  }, []);

  useEffect(() => {
    fetchOrderCounts();
  }, []);

  useEffect(() => {
    if (search === "" && filter === "") {
      fetchAllOrderByUser(true);
    } else if (search !== "" || filter !== "") {
      fetchAllOrderByUser(true);
    }
  }, [search, filter]);

  useEffect(() => {
    if (inView && hasNext) {
      fetchAllOrderByUser();
    }
  }, [inView, hasNext]);

  const [reviewedAllOrder, setReviewedAllOrder] = useState({});

  const checkIfAllOrderReviewed = async (orderId) => {
    try {
      const response = await isAllOrderReviewed(orderId);
      setReviewedAllOrder((prev) => ({ ...prev, [orderId]: response.result }));
    } catch (error) {
      console.error(`Error checking if all order reviewed: `, error);
    }
  };

  useEffect(() => {
    listOrder.forEach((order) => {
      checkIfAllOrderReviewed(order.id);
    });
  }, [listOrder]);

  const [reviewedAnyOrder, setReviewedAnyOrder] = useState({});

  const checkIfAnyOrderReviewed = async (orderId) => {
    try {
      const response = await isAnyOrderReviewed(orderId);
      setReviewedAnyOrder((prev) => ({ ...prev, [orderId]: response.result }));
    } catch (error) {
      console.error(`Error checking if any order reviewed: `, error);
    }
  };

  useEffect(() => {
    listOrder.forEach((order) => {
      checkIfAnyOrderReviewed(order.id);
    });
  }, [listOrder]);

  const listOrderStatus = [
    { label: "Tất cả", filterKey: "" },
    { label: "Chờ thanh toán", filterKey: "ON_HOLD" },
    { label: "Vận chuyển", filterKey: "IN_TRANSIT" },
    { label: "Chờ giao hàng", filterKey: "WAITING_DELIVERY" },
    { label: "Hoàn thành", filterKey: "DELIVERED" },
    { label: "Đã hủy", filterKey: "CANCELLED" },
  ];

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
        return "Đơn hàng chờ giao cho ĐVVC";
      case "PICKED_UP":
        return "Đơn hàng đã được giao cho ĐVVC";
      case "OUT_FOR_DELIVERY":
        return "Đơn hàng đang trên đường giao đến bạn, vui lòng chú ý điện thoại";
      case "DELIVERED":
        return "Đơn hàng đã được giao thành công";
      case "CANCELLED":
        return "Đơn hàng đã bị hủy";
    }
  }

  function getPaymentMethodOrder(status) {
    switch (status) {
      case "COD":
        return "Thanh toán khi nhận hàng";
      case "VN_PAY":
        return "Thanh toán VN PAY";
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
    }
  }

  return (
    <>
      <Toaster />

      {!loadPage && (
        <div className="flex flex-col justify-center items-center">
          <Tabs
            value={filter}
            className="min-h-screen max-w-[1400px] min-w-[1200px] border rounded-lg px-8 py-4 mb-4"
          >
            <TabsList className="w-full flex items-center justify-between">
              {listOrderStatus.map((item, index) => (
                <TabsTrigger
                  key={index}
                  value={item.filterKey}
                  onClick={() => handleFilter(item.filterKey)}
                >
                  {item.label} ({orderCounts[item.filterKey] || 0})
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent
              value={filter}
              className="flex flex-col space-y-8 pb-4"
            >
              <div className="w-full flex items-center relative">
                <Search className="absolute left-3 top-3 h-7 w-7 hover:cursor-pointer" />
                <Input
                  placeholder="Bạn có thể tìm kiếm đơn hàng theo Mã đơn hàng, Tên cửa hàng hoặc Tên sản phẩm"
                  className="pl-12 h-[50px]"
                  onChange={(e) => handleSerach(e.target.value)}
                />
              </div>

              {listOrder.length > 0 &&
                listOrder.map((order) => (
                  <Card
                    key={order.id}
                    className="flex flex-col border-2 border-black-primary border-opacity-15"
                  >
                    <CardTitle className="flex items-center justify-between px-8 py-4 space-x-4">
                      <div
                        className="flex items-center space-x-4 hover:cursor-pointer"
                        onClick={() => handleClickViewShop(order.storeId)}
                      >
                        <Image
                          alt="ảnh shop"
                          src={order.avatarStore || StoreEmpty}
                          height={30}
                          width={30}
                          unoptimized={true}
                          priority
                          className="rounded-full transition-transform duration-300"
                        />
                        <Label className="text-xl text-center hover:cursor-pointer">
                          {order.storeName}
                        </Label>
                        <Rating
                          value={order.ratingStore}
                          precision={0.1}
                          readOnly
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <Button
                          variant="outline"
                          className="flex items-center space-x-2"
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
                            <TooltipContent className="flex flex-col space-y-2">
                              <Label>Cập Nhật Mới Nhất</Label>
                              <Label>{formatDate(order.lastUpdatedAt)}</Label>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Badge variant="outline" className="text-center">
                          {getPaymentMethodOrder(order.paymentMethod)}
                        </Badge>
                        <Badge variant="outline" className="text-center">
                          {getTransactionStatusOrder(
                            order.currentStatusTransaction
                          )}
                        </Badge>
                        <div className="w-[1px] h-7 bg-black-primary"></div>
                        <Label className="text-sm text-center font-bold text-error-dark">
                          {getStatusOrder(order.currentStatus)}
                        </Label>
                      </div>
                    </CardTitle>

                    <CardContent
                      className="flex flex-col items-center justify-center p-8 space-y-8 border-t"
                      onClick={() => handleOnClickViewOrderDetail(order.id)}
                    >
                      {order?.orderItems.map((item) => (
                        <Card
                          key={item.id}
                          className="w-full flex items-center justify-between p-4 hover:cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <Image
                              alt={item.productName}
                              src={item.productMainImageUrl}
                              height={100}
                              width={100}
                              unoptimized={true}
                              priority
                              className="rounded-md transition-transform duration-300 hover:scale-125"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClickViewProduct(item.productSlug);
                              }}
                            />
                            <div className="flex flex-col space-y-2">
                              <Label
                                className="text-xl font-bold hover:text-2xl hover:cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClickViewProduct(item.productSlug);
                                }}
                              >
                                {item.productName}
                              </Label>
                              <Label className="text-sm text-muted-foreground hover:cursor-pointer">
                                {item.values
                                  ? `Phân loại hàng: ${item.values.join(" | ")}`
                                  : ""}
                              </Label>
                              <Label className="text-sm hover:cursor-pointer">
                                x {item.quantity}
                              </Label>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label className="line-through text-sm text-black-primary text-opacity-50 hover:cursor-pointer">
                              {formatCurrency(item.price)}
                            </Label>
                            <Label className="text-sm hover:cursor-pointer">
                              {formatCurrency(item.price - item.discount)}
                            </Label>
                          </div>
                        </Card>
                      ))}
                    </CardContent>

                    <CardFooter className="flex flex-col px-8 py-4 space-y-4 border-t">
                      <div className="w-full flex items-center justify-end space-x-4">
                        <Label className="text-sm">Thành tiền: </Label>
                        <Label className="text-2xl font-bold">
                          {formatCurrency(order?.grandTotal)}
                        </Label>
                      </div>
                      <div className="w-full flex items-center justify-between">
                        <Label className="w-3/5 text-sm">
                          {order.note
                            ? `Ghi chú của bạn: ${order.note}`
                            : "(không có ghi chú)"}
                        </Label>
                        <div className="flex items-center space-x-4">
                          {order.currentStatus === "DELIVERED" ||
                          order.currentStatus === "CANCELLED" ? (
                            <Button
                              variant="outline"
                              onClick={() =>
                                handleClickRePurchase(order.orderItems)
                              }
                            >
                              Mua lại
                            </Button>
                          ) : null}

                          {order.currentStatus === "ON_HOLD" ? (
                            <Button
                              variant="outline"
                              onClick={() => {
                                handleClickCancel(order);
                              }}
                            >
                              Hủy đơn hàng
                            </Button>
                          ) : null}

                          {order.currentStatus === "DELIVERED" &&
                          !reviewedAllOrder[order.id] ? (
                            <Button
                              variant="outline"
                              onClick={() => {
                                handleClickReview(order);
                              }}
                            >
                              Đánh giá
                            </Button>
                          ) : null}

                          {reviewedAnyOrder[order.id] ? (
                            <Button
                              variant="outline"
                              onClick={() => {
                                handleClickViewReview(order);
                              }}
                            >
                              Xem đánh giá shop
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}

              {listOrder.length === 0 && (
                <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
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

            {loadListOrder && (
              <div className="w-full h-16 flex items-center justify-center">
                <div className="flex space-x-4">
                  <div className="w-4 h-4 bg-red-primary rounded-full animate-bounce"></div>
                  <div className="w-4 h-4 bg-red-primary rounded-full animate-bounce [animation-delay:-.1s]"></div>
                  <div className="w-4 h-4 bg-red-primary rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
              </div>
            )}
          </Tabs>
        </div>
      )}

      {!loadListOrder && hasNext && (
        <div ref={loadRef} className="w-full h-24"></div>
      )}

      {openDialog && (
        <>
          <div className="fixed inset-0 bg-black-primary bg-opacity-85 z-[150]" />
          <DialogUpdateOrCancelOrder
            onOpen={openDialog}
            onClose={() => setOpenDialog(false)}
            onCancelOrder={confirmCancelOrder}
            selectedOrder={selectedOrder}
            actionType={actionType}
          />
        </>
      )}

      {openReview && (
        <>
          <div className="fixed inset-0 bg-black-primary bg-opacity-85 z-[150]" />
          <OrderReviewDialog
            onOpen={openReview}
            onClose={() => setOpenReview(false)}
            orderId={selectedOrder.id}
            toast={toast}
            refreshPage={() => fetchAllOrderByUser(true)}
          />
        </>
      )}

      {openViewReview && (
        <>
          <div className="fixed inset-0 bg-black-primary bg-opacity-85 z-[150]" />
          <OrderViewReviewDialog
            onOpen={openViewReview}
            onClose={() => setOpenViewReview(false)}
            storeId={selectedOrder.storeId}
          />
        </>
      )}

      {loadPage && (
        <div className="fixed inset-0 flex flex-col justify-center items-center z-[500] space-y-4 bg-black-primary">
          <CircularProgress />
          <Label className="text-2xl text-white-primary">
            Đang tải dữ liệu...
          </Label>
        </div>
      )}
    </>
  );
}
