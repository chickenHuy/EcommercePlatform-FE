"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useInView } from "react-intersection-observer";
import { Rating } from "@mui/material";
import { CircleHelp, Forklift, Search } from "lucide-react";

import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { OrderReviewDialog } from "@/components/dialogs/dialogReview";
import DialogUpdateOrCancelOrder from "@/components/dialogs/dialogUpdateOrCancelOrder";
import { OrderViewReviewDialog } from "@/components/dialogs/dialogViewReview";
import Loading from "@/components/loading";

import { useToast } from "@/hooks/use-toast";

import { formatCurrency, formatDate } from "@/utils";

import { cancelOrderByUser, getAllOrderByUser, isAllOrderReviewed, isAnyOrderReviewed } from "@/api/user/orderRequest";
import { addToCart } from "@/api/cart/addToCart";

import { setStore } from "@/store/features/userSearchSlice";
import { changeQuantity } from "@/store/features/cartSlice";

import StoreEmpty from "@/assets/images/storeEmpty.jpg";
import ReviewEmpty from "@/assets/images/ReviewEmpty.png";
import { useTranslations } from "next-intl";


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
  const [reviewedAllOrder, setReviewedAllOrder] = useState({});
  const [reviewedAnyOrder, setReviewedAnyOrder] = useState({});

  const [loadListOrder, setLoadListOrder] = useState(false);
  const [loadPage, setLoadPage] = useState(false);

  const { toast } = useToast();
  const t = useTranslations("User.order");

  const { ref: loadRef, inView } = useInView();

  const handleClickRePurchase = async (listOrderItem) => {
    try {
      const listCartItemFromOrder = await Promise.all(
        listOrderItem.map(async (orderItem) => {
          const response = await addToCart({
            productId: orderItem.productId,
            variantId: orderItem.variantId,
            quantity: 1,
          });
          dispatch(changeQuantity((prev) => prev + 1));
          return response.result;
        })
      );

      localStorage.setItem("listCartItemFromOrder", JSON.stringify(listCartItemFromOrder));
      router.push("/cart");
    } catch (error) {
      toast({ title: "Mua lại thất bại", description: error.message, variant: "destructive" });
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
    if (!orderToCancel) return;
    try {
      await cancelOrderByUser(orderToCancel.id);
      toast({ description: `Đơn hàng "${orderToCancel.id}" đã được hủy thành công` });
      fetchAllOrderByUser(true);
      setOpenDialog(false);
    } catch (error) {
      toast({ title: "Thất bại", description: error.message, variant: "destructive" });
    }
  };

  const fetchAllOrderByUser = useCallback(
    async (isInitialLoad = false) => {
      setLoadListOrder(true);
      try {
        if (!isInitialLoad) await new Promise((resolve) => setTimeout(resolve, 500));
        const response = await getAllOrderByUser(
          isInitialLoad ? 1 : nextPage,
          pageSize,
          sortBy,
          orderBy,
          search,
          filter
        );

        setListOrder((prev) => (isInitialLoad ? response.result.data : [...prev, ...response.result.data]));
        setNextPage(response.result.nextPage);
        setHasNext(response.result.hasNext);
      } catch (error) {
        console.error("Error fetching all order by user:", error);
      } finally {
        setLoadListOrder(false);
      }
    },
    [nextPage, search, filter]
  );

  const fetchOrderCounts = useCallback(async () => {
    setLoadPage(true);
    try {
      const response = await Promise.all(
        listOrderStatus.map((status) => getAllOrderByUser(1, 1, sortBy, orderBy, "", status.filterKey))
      );
      setOrderCounts(response.reduce((acc, res, index) => ({ ...acc, [listOrderStatus[index].filterKey]: res.result.totalElements }), {}));
    } catch (error) {
      console.error("Error fetching order counts:", error);
    }
    finally {
      setLoadPage(false);
    }
  }, []);

  useEffect(() => {
    fetchOrderCounts();
  }, []);

  useEffect(() => {
    fetchAllOrderByUser(true);
  }, [search, filter]);

  useEffect(() => {
    if (inView && hasNext) fetchAllOrderByUser();
  }, [inView, hasNext]);

  const checkIfOrderReviewed = async (orderId, checkFn, setState) => {
    try {
      const response = await checkFn(orderId);
      setState((prev) => ({ ...prev, [orderId]: response.result }));
    } catch (error) {
      console.error(`Error checking order review status:`, error);
    }
  };

  useEffect(() => {
    listOrder.forEach((order) => {
      checkIfOrderReviewed(order.id, isAllOrderReviewed, setReviewedAllOrder);
      checkIfOrderReviewed(order.id, isAnyOrderReviewed, setReviewedAnyOrder);
    });
  }, [listOrder]);


  const listOrderStatus = [
    { label: t('all'), filterKey: "" },
    { label: t('on_hold'), filterKey: "ON_HOLD" },
    { label: t('in_transit'), filterKey: "IN_TRANSIT" },
    { label: t('waiting_delivery'), filterKey: "WAITING_DELIVERY" },
    { label: t('delivered'), filterKey: "DELIVERED" },
    { label: t('cancelled'), filterKey: "CANCELLED" },
  ];

  function getMessageOrder(status) {
    switch (status) {
      case "ON_HOLD":
        return t('ON_HOLD');
      case "PENDING":
        return t('PENDING');
      case "CONFIRMED":
        return t('CONFIRMED');
      case "PREPARING":
        return t('PREPARING');
      case "WAITING_FOR_SHIPPING":
        return t('WAITING_FOR_SHIPPING');
      case "PICKED_UP":
        return t('PICKED_UP');
      case "OUT_FOR_DELIVERY":
        return t('OUT_FOR_DELIVERY');
      case "DELIVERED":
        return t('DELIVERED');
      case "CANCELLED":
        return t('CANCELLED');
    }
  }

  function getPaymentMethodOrder(status) {
    switch (status) {
      case "COD":
        return t('COD');
      case "VN_PAY":
        return t('VN_PAY');
    }
  }

  function getTransactionStatusOrder(status) {
    switch (status) {
      case "WAITING":
        return t('WAITING');
      case "SUCCESS":
        return "Đã thanh toán";
    }
  }

  function getStatusOrder(status) {
    switch (status) {
      case "ON_HOLD":
        return t('ON_HOLD_1');
      case "PENDING":
        return t('PENDING_1');
      case "CONFIRMED":
        return t('CONFIRMED_1');
      case "PREPARING":
        return t('PREPARING_1');
      case "WAITING_FOR_SHIPPING":
        return t('WAITING_FOR_SHIPPING_1');
      case "PICKED_UP":
        return t('PICKED_UP_1');
      case "OUT_FOR_DELIVERY":
        return t('OUT_FOR_DELIVERY_1');
      case "DELIVERED":
        return t('DELIVERED_1');
      case "CANCELLED":
        return t('CANCELLED_1');
    }
  }

  return (
    <>
      {!loadPage && (
        <div className="flex flex-col justify-center items-center pl-0 lg:pl-[300px]">
          <Tabs
            value={filter}
            className="w-[95%] h-fit min-h-full border rounded-md"
          >
            <TabsList className="w-full flex items-center justify-between rounded-b-none rounede-t-sm h-10">
              {listOrderStatus.map((item, index) => (
                <TabsTrigger
                  key={index}
                  value={item.filterKey}
                  onClick={() => setFilter(item.filterKey)}
                  className="w-full h-fix text-center "
                >
                  <span>
                    {item.label} ({orderCounts[item.filterKey] || 0})
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent
              value={filter}
              className="flex flex-col space-y-7 px-7 py-3"
            >
              {listOrder.length > 0 &&
                <div className="w-full flex items-center relative mx-auto">
                  <Search className="absolute right-5 top-1/2 -translate-y-1/2 h-6 w-6 cursor-pointer" />
                  <Input
                    placeholder={t('search_orders')}
                    className="h-[45px] px-5 rounded-full"
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setNextPage(1);
                    }}
                  />
                </div>
              }

              {listOrder.length > 0 &&
                listOrder.map((order) => (
                  <Card
                    key={order.id}
                    className="rounded-md"
                  >
                    <CardTitle className="flex items-center justify-between px-7 py-2 border-b-[1px]">
                      <div
                        className="flex items-center space-x-4 hover:cursor-pointer"
                        onClick={() => {
                          router.push("/search");
                          dispatch(setStore(order.storeId));
                        }}
                      >
                        <Image
                          alt="Shop avatar"
                          src={order.avatarStore || StoreEmpty}
                          height={20}
                          width={20}
                          className="rounded-full w-8 h-8 object-contain shadow-sm shadow-white-tertiary"
                        />
                        <span>{order.storeName}</span>
                        <Rating
                          value={order.ratingStore}
                          precision={0.1}
                          readOnly
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <Button
                          className="flex items-center gap-2 h-8 bg-black-secondary"
                          onClick={() => router.push(`orders/detail/${order.id}`)}
                        >
                          <Forklift />
                          <span className="hover:cursor-pointer">
                            {getMessageOrder(order.currentStatus)}
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <CircleHelp className="cursor-pointer scale-[0.8]" />
                              </TooltipTrigger>
                              <TooltipContent className="flex flex-col gap-2 justify-center items-center">
                                <span>{t('last_updated')}</span>
                                <span>{formatDate(order.lastUpdatedAt)}</span>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Button>
                        <Button variant="outline" className="text-center h-8 cursor-default">
                          {getPaymentMethodOrder(order.paymentMethod)}
                        </Button>
                        <Button variant="outline" className="text-center h-8 cursor-default">
                          {getTransactionStatusOrder(
                            order.currentStatusTransaction
                          )}
                        </Button>
                        <div className="w-[1px] h-6 bg-black-secondary"></div>
                        <span className="text-sm text-center text-red-primary">
                          {getStatusOrder(order.currentStatus)}
                        </span>
                      </div>
                    </CardTitle>
                    <CardContent
                      className="flex flex-col gap-3 p-4"
                      onClick={() => router.push(`orders/detail/${order.id}`)}
                    >
                      {order?.orderItems.map((item) => (
                        <Card
                          key={item.id}
                          className="w-full flex flex-col items-start lg:flex-row lg:items-center justify-between p-3 cursor-pointer rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Image
                              src={item.productMainImageUrl}
                              height={80}
                              width={80}
                              className="rounded-md border w-20 h-20 object-cover"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/${item.productSlug}`);
                              }}
                            />
                            <div className="flex flex-col justify-start items-start">
                              <span
                                className="text-[em]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/${item.productSlug}`);
                                }}
                              >
                                {item.productName}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {item.values
                                  ? `${t('classify')} ${item.values.join(" | ")}`
                                  : ""}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                x {item.quantity}
                              </span>
                            </div>
                          </div>
                          <div className="w-full flex justify-end gap-2">
                            <span className="line-through text-sm text-black-tertiary text-opacity-50">
                              {formatCurrency(item.price)}
                            </span>
                            <span className="text-md text-red-primary">
                              {formatCurrency(item.price - item.discount)}
                            </span>
                          </div>
                        </Card>
                      ))}
                    </CardContent>

                    <CardFooter className="flex flex-row px-4 py-2 gap-3 border-t-[1px]">
                      <span className="text-sm w-full max-w-[400px] h-9 border-[1px] px-3 py-2 rounded-sm overflow-auto">
                        {order.note
                          ? `Ghi chú: ${order.note}`
                          : t('no_notes')}
                      </span>
                      <div className="w-full flex-grow flex items-center justify-end gap-2">
                        <span className="text-sm w-fit">{t('total_amount')} </span>
                        <span className="text-[1.3em] font-bold text-red-primary">
                          {formatCurrency(order?.grandTotal)}
                        </span>
                      </div>
                      <div className="w-fit flex items-center justify-end">
                        <div className="flex items-center space-x-4">
                          {order.currentStatus === "DELIVERED" ||
                            order.currentStatus === "CANCELLED" ? (
                            <Button
                              className="bg-black-secondary"
                              onClick={() =>
                                handleClickRePurchase(order.orderItems)
                              }
                            >
                              Mua lại
                            </Button>
                          ) : null}

                          {order.currentStatus === "ON_HOLD" ? (
                            <Button
                              className="bg-black-secondary"
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
                              className="bg-black-secondary"
                              onClick={() => {
                                handleClickReview(order);
                              }}
                            >
                              Đánh giá
                            </Button>
                          ) : null}

                          {reviewedAnyOrder[order.id] ? (
                            <Button
                              className="bg-black-secondary"
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
                <div className="flex flex-col items-center justify-center">
                  <Image
                    alt="List order empty"
                    src={ReviewEmpty}
                    width={400}
                    height={400}
                  />
                </div>
              )}
            </TabsContent>

            {loadListOrder && (
              <Loading />
            )}
          </Tabs>
        </div >
      )
      }

      {
        !loadListOrder && hasNext && (
          <div ref={loadRef} className="w-full h-24"></div>
        )
      }

      {
        openDialog && (
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
        )
      }

      {
        openReview && (
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
        )
      }

      {
        openViewReview && (
          <>
            <div className="fixed inset-0 bg-black-primary bg-opacity-85 z-[150]" />
            <OrderViewReviewDialog
              onOpen={openViewReview}
              onClose={() => setOpenViewReview(false)}
              storeId={selectedOrder.storeId}
            />
          </>
        )
      }

      {
        loadPage && (
          <div className="w-full h-full lg:pl-[300px] relative">
            <Loading />
          </div>
        )
      }
    </>
  );
}
