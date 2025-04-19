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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, span, TableRow } from "@/components/ui/table";
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
      toast({ description: `Đơn hàng "${orderToCancel.id}" đã được hủy thành công` });
      refreshPage();
      setOpenDialog(false);
    } catch (error) {
      toast({ title: "Thất bại", description: error.message, variant: "destructive" });
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
      localStorage.setItem("listCartItemFromOrder", JSON.stringify(listCartItemFromOrder));
      router.push("/cart");
    } catch (error) {
      toast({ title: "Mua lại thất bại", description: error.message, variant: "destructive" });
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

  const bgBookText = hasStatus(["ON_HOLD", "PENDING"]) ? "border-success-dark" : "border-gray-primary";
  const bgForklift = hasStatus(["PICKED_UP"]) ? "border-success-dark" : "border-gray-primary";
  const bgImport = hasStatus(["DELIVERED"]) ? "border-success-dark" : "border-gray-primary";

  const findLastStatus = useCallback((statusName) => {
    const status = listOrderStatusHistory?.find((h) => h.orderStatusName === statusName);
    return status ? new Date(status.createdAt) : null;
  }, [listOrderStatusHistory]);

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

  const getStatusOrder = (status) => ({
    ON_HOLD: "CHỜ THANH TOÁN",
    PENDING: "CHỜ XÁC NHẬN",
    CONFIRMED: "ĐÃ XÁC NHẬN",
    PREPARING: "CHUẨN BỊ HÀNG",
    WAITING_FOR_SHIPPING: "CHỜ GIAO CHO ĐVVC",
    PICKED_UP: "ĐÃ GIAO CHO ĐVVC",
    OUT_FOR_DELIVERY: "ĐANG GIAO HÀNG",
    DELIVERED: "HOÀN THÀNH",
    CANCELLED: "ĐÃ HỦY",
  }[status]);

  const getTimelineIconOrder = (status) => ({
    ON_HOLD: <CircleDollarSign />,
    PENDING: <Store />,
    OUT_FOR_DELIVERY: <Forklift />,
    DELIVERED: <CircleCheck />,
    CANCELLED: <CircleX />,
  }[status] || <Dot />);

  const getMessageStatusOrder = (status) => ({
    ON_HOLD: "Chờ thanh toán",
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    PREPARING: "Chuẩn bị hàng",
    WAITING_FOR_SHIPPING: "Chờ giao cho ĐVVC",
    PICKED_UP: "Đã giao cho ĐVVC",
    OUT_FOR_DELIVERY: "Đang giao hàng",
    DELIVERED: "Hoàn thành",
    CANCELLED: "Đã hủy",
  }[status]);

  const getMessageDescriptionOrder = (status) => ({
    ON_HOLD: "Đơn hàng đang chờ thanh toán",
    PENDING: "Đơn hàng đang chờ người bán xác nhận",
    CONFIRMED: "Người bán đã xác nhận đơn hàng",
    PREPARING: "Người bán đang chuẩn bị hàng",
    WAITING_FOR_SHIPPING: "Chờ người bán giao hàng cho đơn vị vận chuyển",
    PICKED_UP: "Đơn vị vận chuyển lấy hàng thành công",
    OUT_FOR_DELIVERY: "Đơn hàng đang trên đường giao đến bạn, vui lòng chú ý điện thoại",
    DELIVERED: "Đơn hàng đã được giao thành công",
    CANCELLED: "Đơn hàng đã bị hủy",
  }[status]);

  return (
    <>
      <div className="w-full h-fit lg:pl-[300px] flex flex-col justify-center items-center">
        <div className="w-[95%] border rounded-md shadow-md p-3">
          <div className="flex lg:items-center items-start justify-between py-3 gap-3">
            <div
              className="cursor-pointer hover:bg-white-secondary rounded-sm hover:shadow-md"
              onClick={() => handleClickComback()}
            >
              <ChevronLeft />
            </div>
            <div className="flex lg:flex-row flex-col lg:items-center items-end gap-2">
              <span className="lg:w-full w-[300px] truncate text-[1em]">
                MÃ ĐƠN HÀNG: {orderDetail?.id}
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
                <div className={`absolute inset-0 rounded-full border-x-8 border-y-2 animate-spin ${bgBookText}`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookText color={clBookText} size={50} />
                </div>
              </div>

              <span className="text-[1.1em] text-center">
                Đơn Hàng Đã Được Đặt
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
                <div className={`absolute inset-0 rounded-full border-x-8 border-y-2 animate-spin ${bgForklift}`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Forklift color={clForklift} size={50} />
                </div>
              </div>
              <span className="text-[1.1em] text-center">Đã Giao Cho ĐVVC</span>
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
                <div className={`absolute inset-0 rounded-full border-x-8 border-y-2 animate-spin ${bgImport}`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Import color={clImport} size={50} />
                </div>
              </div>
              <span className="text-[1.1em] text-center">Đã Nhận Được Hàng</span>
              <span className="text-muted-foreground text-[0.9em]">
                {lastDelivered ? formatDate(lastDelivered) : null}
              </span>
            </div>
          </div>

          <Separator></Separator>

          <div className="flex items-center justify-center space-x-4 py-4">
            {orderDetail?.currentStatus === "DELIVERED" ||
              orderDetail?.currentStatus === "CANCELLED" ? (
              <Button
                variant="outline"
                onClick={() => handleClickRePurchase(orderDetail?.orderItems)}
              >
                Mua lại
              </Button>
            ) : null}

            {orderDetail?.currentStatus === "DELIVERED" &&
              !reviewedAllOrder[orderDetail.id] ? (
              <Button
                variant="outline"
                onClick={() => {
                  handleClickReview(orderDetail);
                }}
              >
                Đánh giá
              </Button>
            ) : null}

            {reviewedAnyOrder[orderDetail.id] ? (
              <Button
                variant="outline"
                onClick={() => {
                  handleClickViewReview(orderDetail);
                }}
              >
                Xem đánh giá shop
              </Button>
            ) : null}

            {orderDetail?.currentStatus === "ON_HOLD" ? (
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelButtonClick(orderDetail);
                }}
              >
                Hủy đơn hàng
              </Button>
            ) : null}

            {(orderDetail?.currentStatus === "PICKED_UP" ||
              orderDetail?.currentStatus === "OUT_FOR_DELIVERY") &&
              !reviewedAnyOrder[orderDetail.id] ? (
              <span className="text-[1.1em] text-center shadow-md px-5 py-2 rounded-md bg-success-dark">
                Đơn hàng sẽ sớm được giao đến bạn
              </span>
            ) : null}

            {(orderDetail?.currentStatus === "PENDING" ||
              orderDetail?.currentStatus === "CONFIRMED" ||
              orderDetail?.currentStatus === "PREPARING" ||
              orderDetail?.currentStatus === "WAITING_FOR_SHIPPING") &&
              !reviewedAnyOrder[orderDetail.id] ? (
              <span className="text-[1.1em] text-center shadow-md px-5 py-2 rounded-md bg-success-dark">
                Đơn hàng sẽ sớm được người bán giao cho ĐVVC
              </span>
            ) : null}
          </div>

          <Separator></Separator>

          <div className="flex flex-col lg:px-6 px-0 my-7 shadow-md border rounded-lg">
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between py-8">
              <div className="lg:w-2/5 w-full flex flex-col gap-4 px-5">
                <span className="text-[1.2em] w-full text-center">Địa Chỉ Nhận Hàng</span>
                <Separator></Separator>
                <div className="flex items-center gap-2">
                  <UserPlus />
                  <span className="text-[1em]">
                    {orderDetail?.recipientName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone />
                  <span className="text-[1em]">
                    {orderDetail?.orderPhone}
                  </span>
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
                <span className="text-[1.2em] w-full text-center">Trạng thái đơn hàng</span>
                <Separator></Separator>
                {listOrderStatusHistory?.map((item, index) => (
                  <TimelineItem key={item.id}>
                    <TimelineOppositeContent
                      sx={{ m: "auto 0" }}
                      // align="right"
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
                  <span className="text-[1.2em]">
                    {orderDetail?.storeName}
                  </span>
                  <Rating
                    value={Number(orderDetail?.ratingStore)}
                    precision={0.1}
                    readOnly
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <CircleHelpIcon className="cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent className="flex flex-col gap-2 p-2">
                      <span>Cập Nhật Mới Nhất</span>
                      <span>{formatDate(orderDetail?.lastUpdatedAt)}</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                    <div className="flex items-center gap-2">
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
                            ? `${t('classify')} ${item.values.join(" | ")}`
                            : ""}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          x {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="w-full flex justify-end gap-2">
                      <span className="line-through text-sm text-black-tertiary ">
                        {formatCurrency(item.price)}
                      </span>
                      <span className="text-md text-red-primary">
                        {formatCurrency(item.price - item.discount)}
                      </span>
                    </div>
                  </Card>
                ))}
                <div className="w-full rounded-lg border shadow-md">
                  <div className="w-full px-3 lg:px-7 py-3 border-b flex flex-row justify-between items-center">
                    <span className="w-1/2 text-left text-black-primary ">
                      Tổng tiền hàng
                    </span>
                    <span className="w-1/2 text-right border-l">
                      {formatCurrency(orderDetail?.total)}
                    </span>
                  </div>
                  <div className="w-full px-3 lg:px-7 py-3 border-b flex flex-row justify-between items-center">
                    <span className="w-1/2 text-left text-black-primary ">
                      Phí vận chuyển
                    </span>
                    <span className="w-1/2 text-right border-l">
                      {formatCurrency(orderDetail?.shippingFee)}
                    </span>
                  </div>
                  <div className="w-full px-3 lg:px-7 py-3 border-b flex flex-row justify-between items-center">
                    <span className="w-1/2 text-left text-black-primary ">
                      Giảm giá phí vận chuyển
                    </span>
                    <span className="w-1/2 text-right border-l">
                      {`- ${formatCurrency(orderDetail?.shippingDiscount)}`}
                    </span>
                  </div>
                  <div className="w-full px-3 lg:px-7 py-3 border-b flex flex-row justify-between items-center">
                    <span className="w-1/2 text-left text-black-primary ">
                      Giảm giá từ Shop
                    </span>
                    <span className="w-1/2 text-right border-l">
                      {`- ${formatCurrency(orderDetail?.discount)}`}
                    </span>
                  </div>
                  <div className="w-full px-3 lg:px-7 py-3 border-b flex flex-row justify-between items-center">
                    <span className="w-1/2 text-left text-black-primary ">
                      Thành tiền
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
              <div className="w-full px-3 lg:px-7 py-3 border-b flex flex-row justify-between items-center">
                <span className="w-1/2 text-left text-black-primary ">
                  Phương thức thanh toán
                </span>
                <span className="w-1/2 text-right border-l">
                  {orderDetail?.paymentMethod === "VN_PAY"
                    ? "VN PAY"
                    : "Thanh toán khi nhận hàng"}
                </span>
              </div>
              <div className="w-full px-3 lg:px-7 py-3 border-b">
                <div className="w-full flex lg:flex-row flex-col items-center justify-center gap-2">
                  <BellRing />
                  <span className="text-sm">Vui lòng thanh toán</span>
                  <span className="text-[1.3em] font-bold text-red-primary">
                    {formatCurrency(orderDetail?.grandTotal)}
                  </span>
                  <span className="text-sm">khi nhận hàng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >

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
              refreshPage={refreshPage}
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
    </>
  );
}
