"use client";
import { useEffect } from "react";
import Loading from "@/components/loading";

const CallBackPage = () => {
  useEffect(() => {
    // Lấy các tham số từ URL
    const query = window.location.search;
    const params = new URLSearchParams(query);

    // Lấy giá trị từ các tham số cụ thể
    const vnpResponseCode = params.get("vnp_ResponseCode");
    const vnpTxnRef = params.get("vnp_TxnRef");

    // Kiểm tra điều kiện và chuyển hướng
    if (vnpResponseCode === "00" && vnpTxnRef) {
      window.location.href = `/status/${vnpTxnRef}`;
    } else {
      console.error("Invalid or missing response code/transaction reference.");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loading />
    </div>
  );
};

export default CallBackPage;
