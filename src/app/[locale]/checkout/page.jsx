"use client"
import CommonHeader from "@/components/headers/commonHeader"
import Address from "./address"
import CheckoutContent from "./content"
import { useSelector } from "react-redux";
import Link from "next/link";
export default function CheckoutPage() {
    const stores = useSelector((state) => state.checkoutReducer.stores);

    if (stores.length === 0) {
        return (
            <div className="container min-w-full min-h-screen flex justify-center items-center ">
                <div className="bg-blue-primary min-w-[360px] min-h-[200px] p-4 shadow-xl flex items-center flex-col justify-center m-2 rounded-xl">
                    Có lỗi xãy ra, vui lòng chọn lại sản phẩm trong giỏ hàng
                    <Link

                        href="/cart" className="text-red-primary">Quay lại giỏ hàng</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col bg-blue-primary">
            <CommonHeader />
            <div className="w-3/4 mx-auto bg-blue-primary bg-opacity-50">
                <Address />
            </div>
            <div className="w-3/4 mx-auto bg-blue-primary bg-opacity-50">
                <CheckoutContent stores={stores} />
            </div>
        </div>
    )

}