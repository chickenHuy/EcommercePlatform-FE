"use client";
import { useState, useEffect } from "react";
import { CheckCircle, Clock, AlertCircle, CreditCard, Home, RotateCcw } from "lucide-react";
import { get } from "@/lib/httpClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { setCheckout } from "@/store/features/checkoutSlice";
import Loading from "@/components/loading";

const StatusPage = ({ params }) => {
    const [statusData, setStatusData] = useState(null);
    const [message, setMessage] = useState("");
    const [statusType, setStatusType] = useState("");
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    dispatch(setCheckout([]));

    const formatVND = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await get(`/api/v1/payments/${params.id}`);
                console.log("Payment status response:", response);
                setStatusData(response);

                const { paymentMethod, status, amount } = response.result;

                if (paymentMethod === "COD") {
                    setMessage(`Vui lòng thanh toán tổng số tiền ${formatVND(amount)} khi nhận hàng.`);
                    setStatusType("COD");
                } else if (paymentMethod === "VN_PAY") {
                    if (status === "WAITING") {
                        setMessage("Chưa nhận được thông tin thanh toán, vui lòng reload sau ít phút để kiểm tra.");
                        setStatusType("WAITING");
                    } else if (status === "SUCCESS") {
                        setMessage("Thanh toán thành công.");
                        setStatusType("SUCCESS");
                    }
                }
            } catch (error) {
                console.error("Error fetching payment status:", error);
                setMessage("Không thể lấy thông tin thanh toán. Vui lòng thử lại sau.");
                setStatusType("ERROR");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    const getStatusIcon = () => {
        const iconProps = { size: 64, className: "drop-shadow-lg" };

        switch (statusType) {
            case "COD":
                return <CreditCard {...iconProps} className="text-black-primary drop-shadow-lg" />;
            case "WAITING":
                return <Clock {...iconProps} className="text-black-primary drop-shadow-lg animate-pulse" />;
            case "SUCCESS":
                return <CheckCircle {...iconProps} className="text-success drop-shadow-lg" />;
            case "ERROR":
                return <AlertCircle {...iconProps} className="text-red-primary drop-shadow-lg" />;
            default:
                return null;
        }
    };

    const getStatusConfig = () => {
        switch (statusType) {
            case "SUCCESS":
                return {
                    bgClass: "bg-gradient-to-br from-success/10 to-success/20 border-success/30",
                    titleColor: "text-success-dark",
                    messageColor: "text-success-dark",
                    buttonClass: "bg-gradient-to-r from-success to-success-dark hover:from-success-dark hover:to-success text-white-primary",
                    badgeClass: "bg-success/20 text-success-dark border-success/40",
                    title: "Thanh toán thành công!",
                    cardBg: "bg-white-primary"
                };
            case "WAITING":
                return {
                    bgClass: "bg-gradient-to-br from-black-primary/5 to-black-primary/10 border-black-primary/20",
                    titleColor: "text-black-primary",
                    messageColor: "text-black-primary",
                    buttonClass: "bg-gradient-to-r from-black-primary to-black-secondary hover:from-black-secondary hover:to-black-primary text-white-primary",
                    badgeClass: "bg-black-primary/10 text-black-primary border-black-primary/30",
                    title: "Đang xử lý thanh toán",
                    cardBg: "bg-white-primary"
                };
            case "COD":
                return {
                    bgClass: "bg-gradient-to-br from-black-primary/5 to-black-primary/10 border-black-primary/20",
                    titleColor: "text-black-primary",
                    messageColor: "text-black-primary",
                    buttonClass: "bg-gradient-to-r from-black-primary to-black-secondary hover:from-black-secondary hover:to-black-primary text-white-primary",
                    badgeClass: "bg-black-primary/10 text-black-primary border-black-primary/30",
                    title: "Thanh toán khi nhận hàng",
                    cardBg: "bg-white-primary"
                };
            case "ERROR":
                return {
                    bgClass: "bg-gradient-to-br from-red-primary/10 to-red-primary/20 border-red-primary/30",
                    titleColor: "text-red-primary",
                    messageColor: "text-red-primary",
                    buttonClass: "bg-gradient-to-r from-red-primary to-red-600 hover:from-red-600 hover:to-red-primary text-white-primary",
                    badgeClass: "bg-red-primary/20 text-red-primary border-red-primary/40",
                    title: "Có lỗi xảy ra",
                    cardBg: "bg-white-primary"
                };
            default:
                return {
                    bgClass: "bg-white-primary border-black-primary/20",
                    titleColor: "text-black-primary",
                    messageColor: "text-black-primary",
                    buttonClass: "bg-gradient-to-r from-black-primary to-black-secondary hover:from-black-secondary hover:to-black-primary text-white-primary",
                    badgeClass: "bg-black-primary/10 text-black-primary border-black-primary/30",
                    title: "Trạng thái thanh toán",
                    cardBg: "bg-white-primary"
                };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white-primary to-black-primary/5">
                <Card className="p-8 max-w-md w-full mx-4 rounded-2xl shadow-2xl bg-white-primary border border-black-primary/10">
                    <CardContent className="text-center space-y-6 p-6">
                        <Loading />
                        <h2 className="text-xl font-emibold text-black-primary">
                            Đang kiểm tra trạng thái thanh toán...
                        </h2>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const config = getStatusConfig();

    return (
        <div className="flex items-center justify-center min-h-screen p-4 relative overflow-hidden">

            <Card className={`relative w-1/3 min-w-[400px] rounded-lg shadow-md border transform transition-all duration-300 animate-fade-in ${config.bgClass}`}>
                <CardContent className="p-8">
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-white-primary rounded-full scale-110 opacity-50 animate-ping"></div>
                                <div className={`relative ${config.cardBg} rounded-full p-6 shadow-xl border border-black-primary/10`}>
                                    {getStatusIcon()}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <div className={`px-4 py-2 text-[.9em] border shadow-sm rounded-md ${config.badgeClass} animate-fade-in-quick`}>
                                {statusType === "COD" && "Thanh toán khi giao hàng"}
                                {statusType === "WAITING" && "Đang chờ xử lý"}
                                {statusType === "SUCCESS" && "Đã thanh toán"}
                                {statusType === "ERROR" && "Lỗi thanh toán"}
                            </div>
                        </div>

                        <h1 className={`text-3xl font-bold ${config.titleColor} leading-tight animate-fade-in-up`}>
                            {config.title}
                        </h1>

                        <div className={`${config.cardBg} backdrop-blur-sm rounded-lg p-6 border border-black-primary/10 shadow-inner`}>
                            <p className={`${config.messageColor} leading-relaxed text-center text-[1em]`}>
                                {message}
                            </p>
                        </div>

                        {statusData?.result && (
                            <Card className={`${config.cardBg} backdrop-blur-sm border border-black-primary/10 shadow-lg animate-fade-in-up`}>
                                <CardHeader className="pb-3">
                                    <h3 className={`text-[1.2em] ${config.titleColor} text-center`}>
                                        Chi tiết đơn hàng
                                    </h3>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-3 text-[.9em]">
                                        <div className="flex justify-between items-center py-2 border-b border-black-primary/10">
                                            <span className="text-black-primary/70">Mã thanh toán:</span>
                                            <span className="font-mono font-semibold bg-black-primary/5 px-2 py-1 rounded text-xs text-black-primary">
                                                {params.id}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-black-primary/10">
                                            <span className="text-black-primary/70">Phương thức:</span>
                                            <span className="text-black-primary">
                                                {statusData.result.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'VN Pay'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-black-primary/70">Tổng tiền:</span>
                                            <span className="text-xl text-red-primary">
                                                {formatVND(statusData.result.amount)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="space-y-3 pt-4 animate-fade-in-up">
                            <Button
                                onClick={() => window.location.href = "/"}
                                className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${config.buttonClass}`}
                                size="lg"
                            >
                                <Home className="w-5 h-5 mr-2" />
                                Quay về trang chủ
                            </Button>

                            {statusType === "WAITING" && (
                                <Button
                                    onClick={() => window.location.reload()}
                                    variant="outline"
                                    className="w-full py-3 rounded-2xl font-medium bg-white-primary text-black-primary border-2 border-black-primary/20 hover:border-black-primary/30 hover:bg-black-primary/5 transition-all duration-300 shadow-md hover:shadow-lg"
                                    size="lg"
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Kiểm tra lại
                                </Button>
                            )}
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};

export default StatusPage;