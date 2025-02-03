import { cancelOrderByUser } from "@/api/user/orderRequest";
import { OrderReviewDialog } from "@/components/dialogs/dialogReview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/utils/commonUtils";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { Rating, Typography } from "@mui/material";
import {
  BellRing,
  BookText,
  ChevronLeft,
  CircleCheck,
  CircleDollarSign,
  CircleHelpIcon,
  CircleX,
  Dot,
  Forklift,
  Import,
  Phone,
  Store,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import StoreEmpty from "@/assets/images/storeEmpty.jpg";
import ProductNotFound from "@/assets/images/productPlaceholder.png";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { setStore } from "@/store/features/userSearchSlice";
import DialogUpdateOrCancelOrder from "@/components/dialogs/dialogUpdateOrCancelOrder";

export default function ViewOrderDetailUser({
  orderDetail,
  listOrderStatusHistory,
  refreshPage,
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState("");
  const { toast } = useToast();

  const handleCancelButtonClick = (orderDetail) => {
    setOpenDialog(true);
    setOrderToCancel(orderDetail);
    setSelectedOrder(orderDetail);
    setActionType("cancel");
  };

  const confirmCancelOrder = async () => {
    if (orderToCancel) {
      try {
        await cancelOrderByUser(orderToCancel.id);
        toast({
          description: `Đơn hàng "${orderToCancel.id}" đã được hủy thành công`,
        });
        refreshPage();
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

  const router = useRouter();
  const handleClickViewProductDetail = (slug) => {
    router.push(`/${slug}`);
  };

  const dispatch = useDispatch();
  const handleClickViewShop = (storeId) => {
    router.push("/search");
    dispatch(setStore(storeId));
  };

  const handleClickComback = () => {
    router.push("/user/orders");
  };

  const handleClickReview = (order) => {
    setOpenReview(true);
    setSelectedOrder(order);
  };

  const hasStatus = (statuses) => {
    return listOrderStatusHistory?.some((status) =>
      statuses.includes(status.orderStatusName)
    );
  };

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
        (history) => history.orderStatusName === statusName
      );
      return status ? new Date(status.createdAt) : null;
    },
    [listOrderStatusHistory]
  );

  const lastOnHoldOrPending = useMemo(() => {
    let time = findLastStatus("ON_HOLD");
    if (!time) {
      time = findLastStatus("PENDING");
    }
    return time;
  }, [findLastStatus]);

  function useFindLastStatus(statusName, history) {
    return useMemo(() => {
      const update = history?.find(
        (history) => history.orderStatusName === statusName
      );
      return update ? new Date(update.createdAt) : null;
    }, [statusName, history]);
  }
  const lastPickedUp = useFindLastStatus("PICKED_UP", listOrderStatusHistory);
  const lastDelivered = useFindLastStatus("DELIVERED", listOrderStatusHistory);

  const lastStatusIndex = listOrderStatusHistory?.length - 1;

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

  function getTimelineIconOrder(status) {
    switch (status) {
      case "ON_HOLD":
        return <CircleDollarSign />;
      case "PENDING":
        return <Store />;
      case "OUT_FOR_DELIVERY":
        return <Forklift />;
      case "DELIVERED":
        return <CircleCheck />;
      case "CANCELLED":
        return <CircleX />;
      default:
        return <Dot />;
    }
  }

  function getMessageStatusOrder(status) {
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

  function getMessageDescriptionOrder(status) {
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
        return "Chờ người bán giao hàng cho đơn vị vận chuyển";
      case "PICKED_UP":
        return "Đơn vị vận chuyển lấy hàng thành công";
      case "OUT_FOR_DELIVERY":
        return "Đơn hàng đang trên đường giao đến bạn, vui lòng chú ý điện thoại";
      case "DELIVERED":
        return "Đơn hàng đã được giao thành công";
      case "CANCELLED":
        return "Đơn hàng đã bị hủy";
    }
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="min-h-screen max-w-[1400px] min-w-[1200px] border rounded-xl px-8 py-4 mb-4">
          <div className="flex items-center justify-between space-x-4 py-4">
            <div
              className="flex items-center space-x-2 hover:cursor-pointer"
              onClick={() => handleClickComback()}
            >
              <ChevronLeft className="h-7 w-7" />
              <Label className="truncate text-xl hover:cursor-pointer">
                TRỞ LẠI
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Label className="truncate text-xl">
                MÃ ĐƠN HÀNG: {orderDetail?.id}
              </Label>
              <div className="w-[1px] h-5 bg-black-primary"></div>
              <Label className="truncate text-xl text-error-dark">
                {getStatusOrder(orderDetail?.currentStatus)}
              </Label>
            </div>
          </div>

          <Separator></Separator>

          <div className="flex justify-between py-4">
            <div className="w-1/5 flex flex-col items-center space-y-2">
              <div
                className={`flex items-center justify-center w-28 h-28 rounded-full border-8 ${bgBookText}`}
              >
                <BookText color={clBookText} size={60} />
              </div>
              <Label className="text-xl text-center">
                Đơn Hàng Đã Được Đặt
              </Label>
              <Label className="text-muted-foreground">
                {lastOnHoldOrPending ? formatDate(lastOnHoldOrPending) : null}
              </Label>
            </div>

            {hasStatus(["PICKED_UP"]) ? (
              <div className="w-1/5 border-t-8 mt-14 border-success-dark"></div>
            ) : (
              <div className="w-1/5 border-t-8 mt-14 border-none"></div>
            )}

            <div className="w-1/5 flex flex-col items-center space-y-2">
              <div
                className={`flex items-center justify-center w-28 h-28 rounded-full border-8 ${bgForklift}`}
              >
                <Forklift color={clForklift} size={60} />
              </div>
              <Label className="text-xl text-center">Đã Giao Cho ĐVVC</Label>
              <Label className="text-muted-foreground">
                {lastPickedUp ? formatDate(lastPickedUp) : null}
              </Label>
            </div>

            {hasStatus(["DELIVERED"]) ? (
              <div className="w-1/5 border-t-8 mt-14 border-success-dark"></div>
            ) : (
              <div className="w-1/5 border-t-8 mt-14 border-none"></div>
            )}

            <div className="w-1/5 flex flex-col items-center space-y-2">
              <div
                className={`flex justify-center items-center w-28 h-28 rounded-full border-8 ${bgImport}`}
              >
                <Import color={clImport} size={60} />
              </div>
              <Label className="text-xl text-center">Đã Nhận Được Hàng</Label>
              <Label className="text-muted-foreground">
                {lastDelivered ? formatDate(lastDelivered) : null}
              </Label>
            </div>
          </div>

          <Separator></Separator>

          <div className="flex items-center justify-center space-x-4 py-4">
            {orderDetail?.currentStatus === "DELIVERED" ||
            orderDetail?.currentStatus === "CANCELLED" ? (
              <Button
                variant="outline"
                onClick={() => handleClickViewShop(orderDetail?.storeId)}
              >
                Mua lại
              </Button>
            ) : null}
            {orderDetail?.currentStatus === "DELIVERED" ? (
              <Button
                variant="outline"
                onClick={() => {
                  handleClickReview(orderDetail);
                }}
              >
                Đánh giá đơn hàng
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
            {orderDetail?.currentStatus === "DELIVERED" ? (
              <OrderReviewDialog order={orderDetail} toast={toast} />
            ) : null}
            {orderDetail?.currentStatus === "PICKED_UP" ||
            orderDetail?.currentStatus === "OUT_FOR_DELIVERY" ? (
              <Label className="text-xl text-center">
                Đơn hàng sẽ sớm được giao đến bạn
              </Label>
            ) : null}
            {orderDetail?.currentStatus === "PENDING" ||
            orderDetail?.currentStatus === "CONFIRMED" ||
            orderDetail?.currentStatus === "PREPARING" ||
            orderDetail?.currentStatus === "WAITING_FOR_SHIPPING" ? (
              <Label className="text-xl text-center">
                Đơn hàng sẽ sớm được người bán giao cho ĐVVC
              </Label>
            ) : null}
          </div>

          <Separator></Separator>

          <div className="flex flex-col px-6 py-4">
            <Label className="text-2xl">Địa Chỉ Nhận Hàng</Label>
            <div className="flex items-start justify-between py-8">
              <div className="w-2/5 flex flex-col space-y-4 pr-8">
                <div className="flex items-center space-x-2">
                  <UserPlus />
                  <Label className="text-sm">
                    {orderDetail?.recipientName}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone />
                  <Label className="text-sm">{orderDetail?.orderPhone}</Label>
                </div>
                <Label className="text-sm">
                  {orderDetail?.defaultAddressStr}
                </Label>
              </div>
              <Timeline
                position="right"
                className="w-3/5 border-l-[1px] border-black-primary border-opacity-25"
              >
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

          <div className="flex flex-col py-8">
            <Card>
              <CardTitle className="flex items-center justify-between px-8 py-4 space-x-4">
                <div
                  className="flex items-center space-x-4 hover:cursor-pointer"
                  onClick={() => handleClickViewShop(orderDetail?.storeId)}
                >
                  <Image
                    alt="ảnh shop"
                    src={orderDetail?.avatarStore || StoreEmpty}
                    height={30}
                    width={30}
                    unoptimized={true}
                    className="rounded-full transition-transform duration-300"
                  />
                  <Label className="text-xl text-center hover:cursor-pointer">
                    {orderDetail?.storeName}
                  </Label>
                  <Rating
                    value={Number(orderDetail?.ratingStore)}
                    precision={0.1}
                    readOnly
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <CircleHelpIcon className="cursor-default" />
                    </TooltipTrigger>
                    <TooltipContent className="flex flex-col space-y-2">
                      <Label>Cập Nhật Mới Nhất</Label>
                      <Label>{formatDate(orderDetail?.lastUpdatedAt)}</Label>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <CardContent className="flex flex-col items-center justify-center p-8 space-y-8 border-t">
                {orderDetail?.orderItems.map((item) => (
                  <Card
                    key={item.id}
                    className="w-full flex items-center justify-between p-4 hover:cursor-pointer"
                    onClick={() => {
                      handleClickViewProductDetail(item.productSlug);
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <Image
                        alt={item.productName}
                        src={item.productMainImageUrl || ProductNotFound}
                        height={100}
                        width={100}
                        unoptimized={true}
                        className="rounded-md transition-transform duration-300 hover:scale-125"
                      />
                      <div className="flex flex-col space-y-2">
                        <Label className="text-xl font-bold hover:text-2xl hover:cursor-pointer">
                          {item.productName}
                        </Label>
                        <Label className="text-sm text-muted-foreground hover:cursor-pointer">
                          {item.values
                            ? `Phân loại hàng ${item.values.join(" | ")}`
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
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="w-3/4 p-4 text-right text-black-primary text-opacity-50">
                        Tổng tiền hàng
                      </TableCell>
                      <TableCell className="w-1/4 text-right">
                        {formatCurrency(orderDetail?.total)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-3/4 p-4 text-right text-black-primary text-opacity-50">
                        Phí vận chuyển
                      </TableCell>
                      <TableCell className="w-1/4 text-right">
                        {formatCurrency(orderDetail?.shippingFee)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-3/4 p-4 text-right text-black-primary text-opacity-50">
                        Giảm giá phí vận chuyển
                      </TableCell>
                      <TableCell className="w-1/4 text-right">
                        {`- ${formatCurrency(orderDetail?.shippingDiscount)}`}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-3/4 p-4 text-right text-black-primary text-opacity-50">
                        Giảm giá từ Shop
                      </TableCell>
                      <TableCell className="w-1/4 text-right">
                        {`- ${formatCurrency(orderDetail?.discount)}`}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-3/4 p-4 text-right text-black-primary text-opacity-50">
                        Thành tiền
                      </TableCell>
                      <TableCell className="w-1/4 text-right">
                        {formatCurrency(orderDetail?.grandTotal)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Separator></Separator>

          <div className="flex flex-col pt-8 px-6">
            <div className="flex items-center space-x-4 p-4 border border-black-primary border-opacity-20">
              <BellRing />
              <div className="flex items-center space-x-2">
                <Label className="text-sm">Vui lòng thanh toán</Label>
                <Label className="text-xl font-bold">
                  {formatCurrency(orderDetail?.grandTotal)}
                </Label>
                <Label className="text-sm">khi nhận hàng</Label>
              </div>
            </div>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="w-3/4 p-4 text-right text-black-primary text-opacity-50">
                    Phương thức thanh toán
                  </TableCell>
                  <TableCell className="w-1/4 text-right">
                    {orderDetail?.paymentMethod === "VN_PAY"
                      ? "VN PAY"
                      : "Thanh toán khi nhận hàng"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
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
            order={selectedOrder}
            toast={toast}
          />
        </>
      )}
    </>
  );
}
