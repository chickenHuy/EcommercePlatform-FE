"use client";
import { useState, useEffect } from "react";
import { CheckCircle, HourglassEmpty, ErrorOutline } from "@mui/icons-material";
import { get } from "@/lib/httpClient";
import { Card } from "@/components/ui/card";
import { Typography } from "@mui/material";
import { Button } from "@/components/ui/button";

const StatusPage = ({ params }) => {
    const [statusData, setStatusData] = useState(null);
    const [message, setMessage] = useState("");
    const [statusType, setStatusType] = useState("");

    const formatVND = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };
    useEffect(() => {
        const fetchData = async () => {
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
            }
        };

        fetchData();
    }, [params.id]);

    const getStatusIcon = () => {
        switch (statusType) {
            case "COD":
                return <ErrorOutline style={{ color: "#F39C12" }} />;
            case "WAITING":
                return <HourglassEmpty style={{ color: "#FFC107" }} />;
            case "SUCCESS":
                return <CheckCircle style={{ color: "#28A745" }} />;
            default:
                return null;
        }
    };

    const getCardStyle = () => {
        switch (statusType) {
            case "SUCCESS":
                return "bg-[#D4EDDA]";
            case "WAITING":
                return "bg-[#FFF3CD]";
            case "COD":
                return "bg-[#FDF2E9]";
            default:
                return "bg-white-primary";
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-primary">
            <Card className={`p-6 w-96 rounded-lg shadow-md ${getCardStyle()}`}>
                <Typography variant="h6" className="mb-4 text-center font-bold">
                    Trạng thái thanh toán
                </Typography>

                <div className="flex items-center justify-center mb-4">
                    {getStatusIcon()}
                    <Typography className="ml-2 text-gray-primary text-center">{message}</Typography>
                </div>

                <div className="flex justify-center mt-4">
                    <Button
                        onClick={() => window.location.href = "/"}
                        className=" px-4 py-2 rounded transition"
                    >
                        Quay về trang chủ
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default StatusPage;
