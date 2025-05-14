import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Rating, Typography } from "@mui/material";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";

import {
  BellRing,
  BookText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleDollarSign,
  CircleHelpIcon,
  CircleX,
  Dot,
  Forklift,
  GitCommitHorizontal,
  GitCommitVertical,
  Import,
  MapPin,
  Phone,
  Store,
  UserPlus,
} from "lucide-react";

import StoreEmpty from "@/assets/images/storeEmpty.jpg";
import ProductNotFound from "@/assets/images/productPlaceholder.png";

import {
  cancelOrderByUser,
  isAllOrderReviewed,
  isAnyOrderReviewed,
} from "@/api/user/orderRequest";
import { addToCart } from "@/api/cart/addToCart";

import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { OrderReviewDialog } from "@/components/dialogs/dialogReview";
import DialogUpdateOrCancelOrder from "@/components/dialogs/dialogUpdateOrCancelOrder";
import { OrderViewReviewDialog } from "@/components/dialogs/dialogViewReview";

import { useDispatch, useSelector } from "react-redux";
import { setStore } from "@/store/features/userSearchSlice";
import { changeQuantity } from "@/store/features/cartSlice";

import { formatCurrency, formatDate } from "@/utils";
import { useTranslations } from "next-intl";

export default function ViewOrderDetailUser({
  orderDetail,
  listOrderStatusHistory,
  refreshPage,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [openDialog, setOpenDialog] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [openViewReview, setOpenViewReview] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState("");

  const [reviewedAllOrder, setReviewedAllOrder] = useState({});
  const [reviewedAnyOrder, setReviewedAnyOrder] = useState({});
  const oldQuantity = useSelector((state) => state.cartReducer.count);
  const t = useTranslations("User.order");

  const checkIfAllOrderReviewed = async (orderId) => {
    try {
      const response = await isAllOrderReviewed(orderId);
      setReviewedAllOrder((prev) => ({ ...prev, [orderId]: response.result }));
    } catch (error) {
      console.error("Error checking if all order reviewed: ", error);
    }
  };

  const checkIfAnyOrderReviewed = async (orderId) => {
    try {
      const response = await isAnyOrderReviewed(orderId);
      setReviewedAnyOrder((prev) => ({ ...prev, [orderId]: response.result }));
    } catch (error) {
      console.error("Error checking if any order reviewed: ", error);
    }
  };

  useEffect(() => {
    checkIfAllOrderReviewed(orderDetail.id);
    checkIfAnyOrderReviewed(orderDetail.id);
  }, [orderDetail]);

  const handleCancelButtonClick = (orderDetail) => {
    setOpenDialog(true);
    setOrderToCancel(orderDetail);
    setSelectedOrder(orderDetail);
    setActionType("cancel");
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;
    try {
      await cancelOrderByUser(orderToCancel.id);
      toast({ description: t("order_cancel", { order: orderToCancel.id }) });
      refreshPage();
      setOpenDialog(false);
    } catch (error) {
      toast({
        title: t("notify"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClickViewProductDetail = (slug) => {
    router.push(`/${slug}`);
  };

  const handleClickViewShop = (storeId) => {
    router.push("/search");
    dispatch(setStore(storeId));
  };

  const handleClickComback = () => {
    router.push("/user/orders");
  };

  const handleClickRePurchase = async (listOrderItem) => {
    try {
      const listCartItemFromOrder = [];
      for (const item of listOrderItem) {
        const response = await addToCart({
          productId: item.productId,
          variantId: item.variantId,
          quantity: 1,
        });
        listCartItemFromOrder.push(response.result);
        dispatch(changeQuantity(oldQuantity + 1));
      }
      localStorage.setItem(
        "listCartItemFromOrder",
        JSON.stringify(listCartItemFromOrder),
      );
      router.push("/cart");
    } catch (error) {
      toast({
        title: t("notify"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClickReview = (order) => {
    setOpenReview(true);
    setSelectedOrder(order);
  };

  const handleClickViewReview = (order) => {
    setOpenViewReview(true);
    setSelectedOrder(order);
  };

  const hasStatus = (statuses) =>
    listOrderStatusHistory?.some((s) => statuses.includes(s.orderStatusName));

  const clBookText = hasStatus(["ON_HOLD", "PENDING"]) ? "green" : "grey";
  const clForklift = hasStatus(["PICKED_UP"]) ? "green" : "grey";
  const clImport = hasStatus(["DELIVERED"]) ? "green" : "grey";

  const bgBookText = hasStatus(["ON_HOLD", "PENDING"])
    ? "border-success-dark"
    : "border-gray-primary";
  const bgForklift = hasStatus(["PICKED_UP"])
    ? "border-success-dark"
    : "border-gray-primary";
  const bgImport = hasStatus(["DELIVERED"])
    ? "border-success-dark"
    : "border-gray-primary";

  const findLastStatus = useCallback(
    (statusName) => {
      const status = listOrderStatusHistory?.find(
        (h) => h.orderStatusName === statusName,
      );
      return status ? new Date(status.createdAt) : null;
    },
    [listOrderStatusHistory],
  );

  const useFindLastStatus = (statusName, history) =>
    useMemo(() => {
      const found = history?.find((h) => h.orderStatusName === statusName);
      return found ? new Date(found.createdAt) : null;
    }, [statusName, history]);

  const lastOnHoldOrPending = useMemo(() => {
    return findLastStatus("ON_HOLD") || findLastStatus("PENDING");
  }, [findLastStatus]);

  const lastPickedUp = useFindLastStatus("PICKED_UP", listOrderStatusHistory);
  const lastDelivered = useFindLastStatus("DELIVERED", listOrderStatusHistory);
  const lastStatusIndex = listOrderStatusHistory?.length - 1;

  const getStatusOrder = (status) =>
    ({
      ON_HOLD: t("ON_HOLD_1"),
      PENDING: t("PENDING_1"),
      CONFIRMED: t("CONFIRMED_1"),
      PREPARING: t("PREPARING_1"),
      WAITING_FOR_SHIPPING: t("WAITING_FOR_SHIPPING_1"),
      PICKED_UP: t("PICKED_UP_1"),
      OUT_FOR_DELIVERY: t("OUT_FOR_DELIVERY_1"),
      DELIVERED: t("DELIVERED_1"),
      CANCELLED: t("CANCELLED_1"),
    })[status];

  const getTimelineIconOrder = (status) =>
    ({
      ON_HOLD: <CircleDollarSign />,
      PENDING: <Store />,
      OUT_FOR_DELIVERY: <Forklift />,
      DELIVERED: <CircleCheck />,
      CANCELLED: <CircleX />,
    })[status] || <Dot />;

  const getMessageStatusOrder = (status) =>
    ({
      ON_HOLD: t("on_hold"),
      PENDING: t("pending"),
      CONFIRMED: t("confirmed"),
      PREPARING: t("preparing"),
      WAITING_FOR_SHIPPING: t("waiting_delivery"),
      PICKED_UP: t("picked_up"),
      OUT_FOR_DELIVERY: t("in_transit"),
      DELIVERED: t("delivered"),
      CANCELLED: t("cancelled"),
    })[status];

  const getMessageDescriptionOrder = (status) =>
    ({
      ON_HOLD: t("ON_HOLD"),
      PENDING: t("PENDING"),
      CONFIRMED: t("CONFIRMED"),
      PREPARING: t("PREPARING"),
      WAITING_FOR_SHIPPING: t("WAITING_FOR_SHIPPING"),
      PICKED_UP: t("PICKED_UP"),
      OUT_FOR_DELIVERY: t("OUT_FOR_DELIVERY"),
      DELIVERED: t("DELIVERED"),
      CANCELLED: t("CANCELLED"),
    })[status];

  return (
    <>
      <div className="w-full h-fit lg:pl-[300px] flex flex-col justify-center items-center">
        <div className="w-[98%] border rounded-md shadow-md p-3">
          <div className="flex lg:items-center items-start justify-between py-3 gap-3">
            <div
              className="cursor-pointer hover:bg-white-secondary rounded-sm hover:shadow-md"
              onClick={() => handleClickComback()}
            >
              <ChevronLeft />
            </div>
            <div className="flex lg:flex-row flex-col lg:items-center items-end gap-2">
              <span className="lg:w-full w-[300px] truncate text-[1em]">
                {t("ORDER_CODE", { orderCode: orderDetail?.id })}
              </span>
              <div className="w-[1px] h-5 bg-black-primary lg:block hidden"></div>
              <span className="whitespace-nowrap text-[1em] text-red-primary shadow-md px-3 py-1 rounded-md">
                {getStatusOrder(orderDetail?.currentStatus)}
              </span>
            </div>
          </div>

          <Separator></Separator>

          <div className="flex lg:flex-row flex-col justify-evenly py-4">
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-28 h-28">
                <div
                  className={`absolute inset-0 rounded-full border-x-8 border-y-2 animate-spin ${bgBookText}`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookText color={clBookText} size={50} />
                </div>
              </div>

              <span className="text-[1.1em] text-center">
                {t("order_placed")}
              </span>
              <span className="text-muted-foreground text-[.9em]">
                {lastOnHoldOrPending ? formatDate(lastOnHoldOrPending) : null}
              </span>
            </div>

            {hasStatus(["PICKED_UP"]) ? (
              <div className="flex lg:flex-row flex-col items-center justify-center">
                <ChevronRight className="w-5 h-5 animate-ping lg:block hidden" />
                <ChevronRight className="w-6 h-6 animate-ping lg:block hidden" />
                <ChevronRight className="w-7 h-7 animate-ping lg:block hidden" />
                <ChevronDown className="w-5 h-5 animate-ping block lg:hidden" />
                <ChevronDown className="w-6 h-6 animate-ping block lg:hidden" />
                <ChevronDown className="w-7 h-7 animate-ping block lg:hidden" />
              </div>
            ) : (
              <div className="flex lg:flex-row flex-col items-center justify-center">
                <ChevronRight className="w-5 h-5 animate-ping lg:block hidden" />
                <ChevronRight className="w-6 h-6 animate-ping lg:block hidden" />
                <ChevronRight className="w-7 h-7 animate-ping lg:block hidden" />
                <ChevronDown className="w-5 h-5 animate-ping block lg:hidden" />
                <ChevronDown className="w-6 h-6 animate-ping block lg:hidden" />
                <ChevronDown className="w-7 h-7 animate-ping block lg:hidden" />
              </div>
            )}

            <div className="flex flex-col items-center space-y-2">
              <div className="relative w-28 h-28">
                <div
                  className={`absolute inset-0 rounded-full border-x-8 border-y-2 animate-spin ${bgForklift}`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Forklift color={clForklift} size={50} />
                </div>
              </div>
              <span className="text-[1.1em] text-center">{t("picked_up")}</span>
              <span className="text-muted-foreground text-[.9em]">
                {lastPickedUp ? formatDate(lastPickedUp) : null}
              </span>
            </div>

            {hasStatus(["DELIVERED"]) ? (
              <div className="flex lg:flex-row flex-col items-center justify-center">
                <ChevronRight className="w-5 h-5 animate-ping lg:block hidden" />
                <ChevronRight className="w-6 h-6 animate-ping lg:block hidden" />
                <ChevronRight className="w-7 h-7 animate-ping lg:block hidden" />
                <ChevronDown className="w-5 h-5 animate-ping block lg:hidden" />
                <ChevronDown className="w-6 h-6 animate-ping block lg:hidden" />
                <ChevronDown className="w-7 h-7 animate-ping block lg:hidden" />
              </div>
            ) : (
              <div className="flex lg:flex-row flex-col items-center justify-center">
                <ChevronRight className="w-5 h-5 animate-ping lg:block hidden" />
                <ChevronRight className="w-6 h-6 animate-ping lg:block hidden" />
                <ChevronRight className="w-7 h-7 animate-ping lg:block hidden" />
                <ChevronDown className="w-5 h-5 animate-ping block lg:hidden" />
                <ChevronDown className="w-6 h-6 animate-ping block lg:hidden" />
                <ChevronDown className="w-7 h-7 animate-ping block lg:hidden" />
              </div>
            )}

            <div className="flex flex-col items-center space-y-2">
              <div className="relative w-28 h-28">
                <div
                  className={`absolute inset-0 rounded-full border-x-8 border-y-2 animate-spin ${bgImport}`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Import color={clImport} size={50} />
                </div>
              </div>
              <span className="text-[1.1em] text-center">
                {t("received_the_item")}
              </span>
              <span className="text-muted-foreground text-[0.9em]">
                {lastDelivered ? formatDate(lastDelivered) : null}
              </span>
            </div>
          </div>

          <Separator></Separator>

          <div className="flex items-center justify-center space-x-4 py-4">
            <div className="w-full h-fit flex flex-col justify-center items-center">
              <div className="relative">
                <svg
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="250pt"
                  height="100pt"
                  viewBox="0 0 300 159"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g
                    transform="translate(0.000000,159.000000) scale(0.100000,-0.100000)"
                    fill="#000000"
                    stroke="none"
                  >
                    <path
                      d="M676 1378 c-13 -18 -16 -53 -16 -169 0 -160 7 -182 50 -159 20 11 21
18 19 146 l-1 134 591 0 591 0 0 -480 0 -481 -280 -2 -281 -2 -6 38 c-9 56
-55 121 -108 153 -126 74 -299 -4 -323 -145 l-7 -44 -64 -1 c-67 -1 -91 -16
-78 -50 5 -13 21 -16 79 -16 l73 -1 21 -42 c11 -24 39 -55 63 -72 39 -28 50
-30 126 -30 76 0 87 2 126 30 24 17 52 48 63 72 l21 42 325 0 325 0 21 -42
c71 -146 313 -144 381 3 18 39 18 39 75 40 49 0 62 4 90 29 l33 29 3 207 3
207 -79 80 c-74 74 -80 83 -85 130 -8 65 -49 149 -89 183 -69 58 -104 69 -235
73 l-123 4 0 57 c0 35 -6 65 -16 79 l-15 22 -629 0 -629 0 -15 -22z m1560
-225 c74 -39 112 -96 129 -195 l6 -38 -196 0 -195 0 0 131 0 131 108 -4 c84
-3 116 -8 148 -25z m231 -349 l53 -46 0 -188 c0 -104 -3 -191 -8 -193 -4 -3
-27 -7 -52 -8 l-45 -4 -7 44 c-21 124 -151 204 -271 167 -64 -19 -112 -57
-133 -106 -10 -22 -20 -40 -23 -40 -3 0 -5 96 -3 212 l3 213 216 -3 217 -3 53
-45z m-1258 -311 c90 -67 95 -176 11 -246 -138 -116 -329 76 -213 214 15 17
41 38 58 45 39 18 110 12 144 -13z m1062 4 c96 -64 105 -178 20 -250 -139
-116 -330 75 -214 214 51 61 134 76 194 36z m-271 -122 c0 -32 -2 -35 -30 -35
-28 0 -30 2 -24 28 9 38 13 42 35 42 15 0 19 -7 19 -35z"
                    />
                    <path
                      d="M177 983 c-16 -16 -6 -53 16 -58 12 -3 159 -4 326 -3 267 3 305 5
314 19 6 9 7 24 4 33 -6 14 -40 16 -330 16 -178 0 -327 -3 -330 -7z"
                    />
                    <path
                      d="M342 824 c-9 -7 -12 -18 -8 -32 l7 -22 327 2 327 3 3 28 c2 15 0 27
-5 27 -319 6 -639 3 -651 -6z"
                    />
                    <path
                      d="M499 664 c-9 -11 -10 -20 -2 -32 9 -15 44 -17 321 -20 272 -2 312 0
326 14 12 12 13 20 6 35 -10 18 -25 19 -324 19 -274 0 -315 -2 -327 -16z"
                    />
                  </g>
                </svg>
                <div className="absolute animate-spin w-9 h-9 rounded-full border-black-primary border-[1px] top-[85px] left-[118px] flex justify-center items-center">
                  <GitCommitVertical className="w-9 h-9" />
                </div>
                <div className="absolute animate-spin w-9 h-9 rounded-full border-black-primary border-[1px] top-[85px] left-[207px] flex justify-center items-center">
                  <GitCommitHorizontal className="w-9 h-9" />
                </div>
              </div>
              {(orderDetail?.currentStatus === "PICKED_UP" ||
                orderDetail?.currentStatus === "OUT_FOR_DELIVERY") &&
              !reviewedAnyOrder[orderDetail.id] ? (
                <span className="text-[1.1em] text-center shadow-md px-5 py-2 rounded-md border text-success-dark border-success-dark">
                  {t("your_order_will_be_delivered_to_you_soon")}
                </span>
              ) : null}

              {(orderDetail?.currentStatus === "PENDING" ||
                orderDetail?.currentStatus === "CONFIRMED" ||
                orderDetail?.currentStatus === "PREPARING" ||
                orderDetail?.currentStatus === "WAITING_FOR_SHIPPING") &&
              !reviewedAnyOrder[orderDetail.id] ? (
                <span className="text-[1.1em] text-center shadow-md px-5 py-2 rounded-md text-success-dark border border-success-dark">
                  {t("your_order_will_be_delivered_to_the_carried_soon")}
                </span>
              ) : null}
            </div>
          </div>

          <Separator></Separator>

          <div className="flex flex-col lg:px-6 px-0 my-7 shadow-md border rounded-lg">
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between py-8">
              <div className="lg:w-2/5 w-full flex flex-col gap-4 px-5">
                <span className="text-[1.2em] w-full text-center">
                  {t("order_receive_address")}
                </span>
                <Separator></Separator>
                <div className="flex items-center gap-2">
                  <UserPlus />
                  <span className="text-[1em]">
                    {orderDetail?.recipientName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone />
                  <span className="text-[1em]">{orderDetail?.orderPhone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin />
                  <span className="text-[1em]">
                    {orderDetail?.defaultAddressStr}
                  </span>
                </div>
              </div>
              <Timeline
                position="right"
                className="lg:w-3/5 w-full lg:border-l-[1px] lg:mt-0 mt-10 border-black-primary border-opacity-25 px-4 flex gap-3"
              >
                <span className="text-[1.2em] w-full text-center">
                  {t("order_status")}
                </span>
                <Separator></Separator>
                {listOrderStatusHistory?.map((item, index) => (
                  <TimelineItem key={item.id}>
                    <TimelineOppositeContent
                      sx={{ m: "auto 0" }}
                      align="right"
                      variant="body"
                      color={index === lastStatusIndex ? "success" : "grey"}
                    >
                      {formatDate(item.createdAt)}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineConnector />
                      <TimelineDot
                        color={index === lastStatusIndex ? "success" : "grey"}
                      >
                        {getTimelineIconOrder(item.orderStatusName)}
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: "12px", px: 2 }}>
                      <Typography
                        variant="h6"
                        component="span"
                        color={index === lastStatusIndex ? "success" : "grey"}
                      >
                        {getMessageStatusOrder(item.orderStatusName)}
                      </Typography>
                      <Typography
                        color={index === lastStatusIndex ? "success" : "grey"}
                      >
                        {getMessageDescriptionOrder(item.orderStatusName)}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </div>
          </div>

          <Separator></Separator>

          <div className="py-7">
            <Card className="rounded-lg">
              <CardTitle className="flex items-center justify-between px-8 py-4 space-x-4">
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => handleClickViewShop(orderDetail?.storeId)}
                >
                  <Image
                    alt="Shop image"
                    src={orderDetail?.avatarStore || StoreEmpty}
                    height={30}
                    width={30}
                    className="rounded-full w-8 h-8 object-contain shadow-sm shadow-white-tertiary"
                  />
                  <span className="text-[1.2em]">{orderDetail?.storeName}</span>
                  <Rating
                    value={Number(orderDetail?.ratingStore)}
                    precision={0.1}
                    readOnly
                  />
                </div>

                <div className="flex flex-row justify-center items-center gap-3">
                  {reviewedAnyOrder[orderDetail.id] ? (
                    <Button
                      onClick={() => {
                        handleClickViewReview(orderDetail);
                      }}
                    >
                      {t("view_review")}
                    </Button>
                  ) : null}

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <CircleHelpIcon className="cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent className="flex flex-col items-center gap-2 p-2">
                        <span>{t("last_updated")}</span>
                        <span>{formatDate(orderDetail?.lastUpdatedAt)}</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardTitle>
              <CardContent className="flex flex-col items-center justify-center p-3 gap-5 border-t round">
                {orderDetail?.orderItems.map((item) => (
                  <Card
                    key={item.id}
                    className="w-full flex flex-col items-start lg:flex-row lg:items-center justify-between p-3 cursor-pointer rounded-lg"
                    onClick={() => {
                      handleClickViewProductDetail(item.productSlug);
                    }}
                  >
                    <div className="w-full flex items-center gap-2">
                      <Image
                        alt={item.productName}
                        src={item.productMainImageUrl || ProductNotFound}
                        height={100}
                        width={100}
                        className="rounded-md border w-20 h-20 object-cover"
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
                            ? `${t("classify")} ${item.values.join(" | ")}`
                            : ""}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          x {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="w-full flex flex-col justify-end items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className="line-through text-sm text-black-tertiary ">
                          {formatCurrency(item.price)}
                        </span>
                        <span className="text-md text-red-primary">
                          {formatCurrency(item.price - item.discount)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {orderDetail?.currentStatus === "DELIVERED" &&
                        !reviewedAllOrder[orderDetail.id] ? (
                          <Button
                            onClick={() => {
                              handleClickReview(orderDetail);
                            }}
                          >
                            {t("review")}
                          </Button>
                        ) : null}
                        {orderDetail?.currentStatus === "DELIVERED" ||
                        orderDetail?.currentStatus === "CANCELLED" ? (
                          <Button
                            onClick={() =>
                              handleClickRePurchase(orderDetail?.orderItems)
                            }
                          >
                            {t("re_purchase")}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                ))}
                <div className="w-full rounded-lg border shadow-md">
                  <div className="w-full px-3 lg:px-7 py-3 border-b flex flex-row justify-between items-center">
                    <span className="w-1/2 text-left text-black-primary ">
                      {t("total_amount")}
                    </span>
                    <span className="w-1/2 text-right border-l">
                      {formatCurrency(orderDetail?.total)}
                    </span>
                  </div>
                  <div className="w-full px-3 lg:px-7 py-3 border-b flex flex-row justify-between items-center">
                    <span className="w-1/2 text-left text-black-primary ">
                      {t("shipping_fee")}
                    </span>
                    <span className="w-1/2 text-right border-l">
                      {formatCurrency(orderDetail?.shippingFee)}
                    </span>
                  </div>
                  <div className="w-full px-3 lg:px-7 py-3 border-b flex flex-row justify-between items-center">
                    <span className="w-1/2 text-left text-black-primary ">
                      {t("discount_shipping")}
                    </span>
                    <span className="w-1/2 text-right border-l">
                      {`- ${formatCurrency(orderDetail?.shippingDiscount)}`}
                    </span>
                  </div>
                  <div className="w-full px-3 lg:px-7 py-3 border-b flex flex-row justify-between items-center">
                    <span className="w-1/2 text-left text-black-primary ">
                      {t("discount_from_shop")}
                    </span>
                    <span className="w-1/2 text-right border-l">
                      {`- ${formatCurrency(orderDetail?.discount)}`}
                    </span>
                  </div>
                  <div className="w-full px-3 lg:px-7 py-3 border-b flex flex-row justify-between items-center">
                    <span className="w-1/2 text-left text-black-primary ">
                      {t("total_payment_amount")}
                    </span>
                    <span className="w-1/2 text-right border-l text-red-primary">
                      {formatCurrency(orderDetail?.grandTotal)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator></Separator>

          <div className="flex flex-col my-7 p-3 rounded-md shadow-md border">
            <div className="w-full rounded-lg border shadow-md">
              <div className="w-full px-3 lg:px-7 py-3 flex flex-row justify-between items-center">
                <span className="w-1/2 text-left text-black-primary ">
                  {t("payment_method")}
                </span>
                <span className="w-1/2 text-right border-l">
                  {orderDetail?.paymentMethod === "VN_PAY"
                    ? "VN PAY"
                    : t("cash_on_delivery")}
                </span>
              </div>
              {orderDetail?.paymentMethod !== "VN_PAY" && (
                <div className="w-full px-3 lg:px-7 py-3 border-t">
                  <div className="w-full flex lg:flex-row flex-col items-center justify-center gap-2">
                    <BellRing />
                    <span className="text-sm">{t("please_pay")}</span>
                    <span className="text-[1.3em] font-bold text-red-primary">
                      {formatCurrency(orderDetail?.grandTotal)}
                    </span>
                    <span className="text-sm">{t("upon_receipt")}</span>
                  </div>
                </div>
              )}
              {orderDetail?.currentStatus === "ON_HOLD" ? (
                <div className="w-full flex justify-end px-7 py-3 border-t">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelButtonClick(orderDetail);
                    }}
                  >
                    {t("cancel_order")}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

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
            refreshPage={refreshPage}
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
    </>
  );
}
