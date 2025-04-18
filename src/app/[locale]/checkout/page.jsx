"use client"
import Address from "./address"
import CheckoutContent from "./content"
import { useSelector } from "react-redux";
import Link from "next/link";
import { useState } from "react";
import UserHeader from "@/components/headers/mainHeader";
export default function CheckoutPage() {
    const stores = useSelector((state) => state.checkoutReducer.stores);
    const [selectedAddress, setSelectedAddress] = useState(null);

    if (stores.length === 0) {
        return (
            <div className="container min-w-full min-h-screen flex justify-center items-center ">
                <div className="bg-blue-primary min-w-[360px] min-h-[200px] p-4 shadow-xl flex items-center flex-col justify-center m-2 rounded-xl">
                    Quay lại giỏ hàng để chọn sản phẩm?
                    <Link

                        href="/cart" className="text-red-primary">Quay lại giỏ hàng</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col bg-blue-primary">
            <UserHeader />
            <div className="w-3/4 mx-auto bg-blue-primary bg-opacity-50">
                <Address defaultAddress={selectedAddress} setDefaultAddress={setSelectedAddress} />
            </div>
            <div className="w-3/4 mx-auto bg-blue-primary bg-opacity-50">
                <CheckoutContent stores={stores} selectedAddress={selectedAddress} />
            </div>
        </div>
    )

}