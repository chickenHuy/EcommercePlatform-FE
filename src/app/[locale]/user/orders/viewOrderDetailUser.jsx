import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
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
import Link from "next/link";
import { Table, TableBody, TableRow } from "@/components/ui/table";
import { Rating, TableCell, Typography } from "@mui/material";
import { Separator } from "@/components/ui/separator";
import { cancelOrderByUser, getOneOrderByUser } from "@/api/user/orderRequest";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect, useMemo, useState } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { TimelineOppositeContent } from "@mui/lab";
import DialogCancelOrderUser from "./dialogCancelOrderUser";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setStore } from "@/store/features/userSearchSlice";
import StoreEmpty from "@/assets/images/storeEmpty.jpg";

export default function ViewOrderDetailUser(props) {
  const { isOpen, onClose, orderId } = props;
  const [order, setOrder] = useState(null);
  const [listOrderStatusHistory, setListOrderStatusHistory] = useState(null);
  const [isDialogCancelOrderOpen, setIsDialogCancelOrderOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState("");
  const { toast } = useToast();

  const router = useRouter();
  const dispatch = useDispatch();
  const handleOnclickViewShop = (storeId) => {
    router.push("/search");
    dispatch(setStore(storeId));
  };

  const handleCancelButtonClick = (order, orderId) => {
    setIsDialogCancelOrderOpen(true);
    setOrderToCancel(order);
    setSelectedOrder(orderId);
    setActionType("cancel");
  };

  const confirmCancelOrder = async () => {
    if (orderToCancel) {
      try {
        await cancelOrderByUser(orderToCancel.id);
        toast({
          title: "Thành công",
          description: `Đơn hàng "#${orderToCancel.id}" đã được hủy`,
        });
        fetchOneOrderByUser();
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

  const fetchOneOrderByUser = useCallback(async () => {
    if (!orderId) {
      return;
    }
    try {
      const response = await getOneOrderByUser(orderId);
      console.log("Order: ", response.result);
      setOrder(response.result);
      console.log(
        "listOrderStatusHistory: ",
        response.result.orderStatusHistories
      );
      setListOrderStatusHistory(response.result.orderStatusHistories);
    } catch (error) {
      toast({
        title: "Lấy thông tin thất bại",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [orderId, toast]);

  useEffect(() => {
    fetchOneOrderByUser();
  }, [fetchOneOrderByUser]);

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
      default:
        return "N/A";
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
      default:
        return "N/A";
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

  const lastStatusIndex = listOrderStatusHistory
    ? listOrderStatusHistory.length - 1
    : -1;

  function formatCurrency(value) {
    return Number(value).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  const statusExists = (statusArray) => {
    return listOrderStatusHistory?.some((status) =>
      statusArray.includes(status.orderStatusName)
    );
  };
  const bookTextColor = statusExists(["ON_HOLD", "PENDING"]) ? "green" : "grey";
  const forkliftColor = statusExists(["PICKED_UP"]) ? "green" : "grey";
  const importColor = statusExists(["DELIVERED"]) ? "green" : "grey";

  const hasStatus = (statuses) => {
    return listOrderStatusHistory?.some((status) =>
      statuses.includes(status.orderStatusName)
    );
  };
  const bookTextBorderClass = hasStatus(["ON_HOLD", "PENDING"])
    ? "border-success-dark"
    : "border-gray-primary";
  const forkliftBorderClass = hasStatus(["PICKED_UP"])
    ? "border-success-dark"
    : "border-gray-primary";
  const importBorderClass = hasStatus(["DELIVERED"])
    ? "border-success-dark"
    : "border-gray-primary";

  function useFindLastUpdateTimeForStatus(statusName, history) {
    return useMemo(() => {
      const update = history?.find(
        (history) => history.orderStatusName === statusName
      );
      return update ? new Date(update.createdAt) : null;
    }, [statusName, history]);
  }
  const lastUpdatedTimePickedUp = useFindLastUpdateTimeForStatus(
    "PICKED_UP",
    listOrderStatusHistory
  );
  const lastUpdatedTimeDelivered = useFindLastUpdateTimeForStatus(
    "DELIVERED",
    listOrderStatusHistory
  );

  const findLastUpdateTimeForStatus = useCallback(
    (statusName) => {
      const status = listOrderStatusHistory?.find(
        (history) => history.orderStatusName === statusName
      );
      return status ? new Date(status.createdAt) : null;
    },
    [listOrderStatusHistory]
  );

  const lastUpdatedTimeOnHoldOrPending = useMemo(() => {
    let time = findLastUpdateTimeForStatus("ON_HOLD");
    if (!time) {
      time = findLastUpdateTimeForStatus("PENDING");
    }
    return time;
  }, [findLastUpdateTimeForStatus]);

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="h-full">
        <ScrollArea className="flex items-center justify-center space-y-4">
          <div className="w-3/4 mx-auto space-y-1">
            <div className="flex items-center justify-between">
              <DrawerClose className="flex items-center space-x-2 m-4">
                <Button variant="outline" size="icon" className="h-7 w-7">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Label className="hover:cursor-pointer">Quay lại</Label>
              </DrawerClose>
              <div className="flex items-center space-x-2 m-4">
                <Label>MÃ ĐƠN HÀNG: #{order?.id}</Label>
                <div className="w-[1px] h-4 bg-black-secondary"></div>
                <Label className="text-error-dark">
                  {getStatusOrder(order?.currentStatus)}
                </Label>
              </div>
            </div>
            <Separator></Separator>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center space-y-1 m-4">
                <div
                  className={`flex justify-center items-center w-28 h-28 rounded-full border-4 ${bookTextBorderClass}`}
                >
                  <BookText color={bookTextColor} size={60} />
                </div>
                <Label className="text-xl">Đơn Hàng Đã Được Đặt</Label>
                <Label className="text-muted-foreground">
                  {lastUpdatedTimeOnHoldOrPending
                    ? formatDate(lastUpdatedTimeOnHoldOrPending)
                    : ""}
                </Label>
              </div>
              {hasStatus(["PICKED_UP"]) && (
                <div className="w-1/5 border-t-4 border-success-dark"></div>
              )}
              <div className="flex flex-col items-center space-y-1 m-4">
                <div
                  className={`flex justify-center items-center w-28 h-28 rounded-full border-4 ${forkliftBorderClass}`}
                >
                  <Forklift color={forkliftColor} size={60} />
                </div>
                <Label className="text-xl">Đã Giao Cho ĐVVC</Label>
                <Label className="text-muted-foreground">
                  {lastUpdatedTimePickedUp
                    ? formatDate(lastUpdatedTimePickedUp)
                    : ""}
                </Label>
              </div>
              {hasStatus(["DELIVERED"]) && (
                <div className="w-1/5 border-t-4 border-success-dark"></div>
              )}
              <div className="flex flex-col items-center space-y-1 m-4">
                <div
                  className={`flex justify-center items-center w-28 h-28 rounded-full border-4 ${importBorderClass}`}
                >
                  <Import color={importColor} size={60} />
                </div>
                <Label className="text-xl">Đã Nhận Được Hàng</Label>
                <Label className="text-muted-foreground">
                  {lastUpdatedTimeDelivered
                    ? formatDate(lastUpdatedTimeDelivered)
                    : ""}
                </Label>
              </div>
            </div>
            <Separator></Separator>
            <div className="flex items-center justify-center">
              {order?.currentStatus === "DELIVERED" ||
              order?.currentStatus === "CANCELLED" ? (
                <Button variant="outline" className="m-4">
                  Mua lại
                </Button>
              ) : (
                ""
              )}
              {order?.currentStatus === "PICKED_UP" ||
              order?.currentStatus === "OUT_FOR_DELIVERY" ||
              order?.currentStatus === "DELIVERED" ||
              order?.currentStatus === "CANCELLED" ? (
                ""
              ) : (
                <Button
                  variant="outline"
                  className="m-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelButtonClick(order, order?.id);
                  }}
                >
                  Hủy đơn hàng
                </Button>
              )}
              {order?.currentStatus === "DELIVERED" ? (
                <Button variant="outline" className="m-4">
                  Xem đánh giá shop
                </Button>
              ) : (
                ""
              )}
              {order?.currentStatus === "PICKED_UP" ||
              order?.currentStatus === "OUT_FOR_DELIVERY" ? (
                <Label className="m-4">Đơn hàng sẽ sớm được giao đến bạn</Label>
              ) : (
                ""
              )}
            </div>
            <Separator></Separator>
            <div className="space-y-4">
              <Label className="text-2xl m-4">Địa Chỉ Nhận Hàng</Label>
              <div className="flex items-center justify-between m-4">
                <div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <UserPlus />
                      <Label>{order?.recipientName}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone />
                      <Label>{order?.orderPhone}</Label>
                    </div>
                    <Label>{order?.defaultAddressStr}</Label>
                  </div>
                </div>
                <div className="w-[1px] h-40 bg-black-secondary"></div>
                <Timeline position="right">
                  {listOrderStatusHistory?.map((item, index) => (
                    <TimelineItem key={item.id}>
                      <TimelineOppositeContent
                        sx={{ m: "auto 0" }}
                        align="right"
                        variant="body2"
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
            <div>
              <Card className="w-full mt-4 mb-8">
                <CardTitle className="flex justify-between items-center gap-4 m-4">
                  <div
                    className="flex items-center gap-4 hover:cursor-pointer"
                    onClick={() => handleOnclickViewShop(order?.storeId)}
                  >
                    <Image
                      alt="ảnh shop"
                      src={order?.avatarStore || StoreEmpty}
                      height={30}
                      width={30}
                      unoptimized={true}
                      className="rounded-full transition-transform duration-300"
                    />
                    <Label className="text-xl hover:cursor-pointer">
                      {order?.storeName}
                    </Label>
                    <Rating
                      value={Number(order?.ratingStore)}
                      precision={0.1}
                      readOnly
                    ></Rating>
                  </div>
                  <div className="flex items-center gap-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <CircleHelpIcon className="cursor-default" />
                        </TooltipTrigger>
                        <TooltipContent className="flex flex-col gap-2">
                          <Label>Cập Nhật Mới Nhất</Label>
                          <Label>{formatDate(order?.lastUpdatedAt)}</Label>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardTitle>
                <CardContent className="flex flex-col items-center justify-center min-h-[150px] space-y-4 border-t hover:cursor-pointer">
                  {order?.orderItems && order?.orderItems.length > 0 ? (
                    order.orderItems.map((item, index) => (
                      <Card
                        key={index}
                        className="flex w-full justify-between items-center gap-4 mt-4"
                      >
                        <div className="flex items-center gap-4 mb-6 ml-6">
                          <Link
                            href="/user/orders"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              alt={item.productName}
                              src={item.productMainImageUrl}
                              height={100}
                              width={100}
                              unoptimized={true}
                              className="mt-6 rounded-md transition-transform duration-300 hover:scale-125 hover:mr-4"
                            />
                          </Link>
                          <div>
                            <Link
                              href="/user/orders"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              <p className="text-xl font-bold hover:text-2xl">
                                {item.productName}
                              </p>
                            </Link>
                            <p className="text-muted-foreground">
                              {item.values
                                ? `Phân loại hàng ${item.values.join(" | ")}`
                                : ""}
                            </p>
                            <p>x{item.quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mr-6">
                          <p className="line-through">
                            {formatCurrency(item.price)}
                          </p>
                          <p>{formatCurrency(item.price - item.discount)}</p>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Label className="text-2xl text-error-dark text-center">
                      Đơn hàng không có sản phẩm
                    </Label>
                  )}
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Tổng tiền hàng</TableCell>
                        <TableCell>{formatCurrency(order?.total)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Phí vận chuyển</TableCell>
                        <TableCell>
                          {formatCurrency(order?.shippingFee)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Giảm giá phí vận chuyển</TableCell>
                        <TableCell>{`- ${formatCurrency(
                          order?.shippingDiscount * order?.shippingFee
                        )}`}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Giảm giá từ Shop</TableCell>
                        <TableCell>{`- ${formatCurrency(
                          order?.discount
                        )}`}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Thành tiền</TableCell>
                        <TableCell>
                          {formatCurrency(order?.grandTotal)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Phương thức thanh toán</TableCell>
                        <TableCell>Thanh toán khi nhận hàng</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
          {isDialogCancelOrderOpen && (
            <DialogCancelOrderUser
              isOpen={isDialogCancelOrderOpen}
              onClose={() => setIsDialogCancelOrderOpen(false)}
              onCancelOrder={confirmCancelOrder}
              orderId={selectedOrder}
              actionType={actionType}
            />
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
