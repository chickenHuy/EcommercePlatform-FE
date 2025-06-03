"use client";
import { useEffect } from "react";
import Loading from "@/components/loading";

const CallBackPage = () => {
  useEffect(() => {
    const query = window.location.search;
    const params = new URLSearchParams(query);

    const vnpResponseCode = params.get("vnp_ResponseCode");
    const vnpTxnRef = params.get("vnp_TxnRef");

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
