"use client"
import Address from "./address"
import CheckoutContent from "./content"

import { ShoppingCart, ArrowLeft } from "lucide-react"
import { useSelector } from "react-redux";
import Link from "next/link";
import { useState } from "react";
import MainHeader from "@/components/headers/mainHeader";
import { useTranslations } from "next-intl";
export default function CheckoutPage() {
    const stores = useSelector((state) => state.checkoutReducer.stores);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const t = useTranslations("Checkout");

    if (stores.length === 0) {
        return (
            <div className="container min-w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-md shadow-md border border-white/20 overflow-hidden">
                        <div className="p-8 text-center space-y-6">
                            <div className="relative">
                                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-purple-200/50 animate-spin-slow"></div>
                                    <ShoppingCart className="w-16 h-16 text-blue-500 z-10" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-gray-800 text-xl font-semibold">
                                    {t("text_return_cart_to_select")}
                                </h3>
                            </div>

                            <Link href="/cart" className="block">
                                <button className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                    <div className="relative flex items-center justify-center gap-2">
                                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                        <span>{t("text_return_cart")}</span>
                                    </div>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full py-20 xl:px-28 lg:px-20 sm:px-6 px-4">
            <MainHeader />
            <div className="w-full h-fit p-3 flex flex-col gap-3 justify-start items-center shadow-md rounded-md">
                <div className="w-full h-fit">
                    <Address defaultAddress={selectedAddress} setDefaultAddress={setSelectedAddress} t={t} />
                </div>
                <div className="w-full h-fit">
                    <CheckoutContent stores={stores} selectedAddress={selectedAddress} t={t} />
                </div>
            </div>
        </div>
    )

}

