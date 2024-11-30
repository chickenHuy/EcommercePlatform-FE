"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BaggageClaim, MessageCircle, StoreIcon } from 'lucide-react'
import Image from "next/image"
import React, { useState } from "react"
import VnPay from "@/assets/images/vnpay.png"
import { useSelector } from "react-redux"
import { Separator } from "@/components/ui/separator"
import EmptyImage from "@/assets/images/brandEmpty.jpg"
import Link from "next/link"


export default function CheckoutContent(props) {
    const {stores} = props;
    const calculateSubtotal = (data) => {
        let subtotal = 0;
        data.forEach(store => {
            store.items.forEach(item => {
                subtotal += item.originalPrice * item.quantity;
            });
        });
        return subtotal;
    };

    const calculateDiscount = (data) => {
        let discount = 0;
        data.forEach(store => {
            store.items.forEach(item => {
                discount += (item.originalPrice - item.salePrice) * item.quantity;
            });
        });
        return discount;
    };

    const subtotal = calculateSubtotal(stores);
    const shippingFee = 24000 * stores.length;
    const discount = calculateDiscount(stores);

    const [paymentMethod, setPaymentMethod] = useState("cod")
    const total = subtotal + shippingFee - discount

    return (
        <div>
            <div className="space-y-6 p-4 rounded-xl  bg-gradient-to-br from-[#ffffff] via-[#a40b0b] to-[#f64a4a] bg-opacity-5">
                <span className="text-2xl p-4 font-semibold">Sản phẩm</span>
                {stores.map((store) => (
                    <Card key={store.storeId} className="rounded p-0">
                        <CardHeader className="flex-row items-center gap-4 pb-2">
                            <StoreIcon className="h-6 w-6 text-red-primary">
                                Hot
                            </StoreIcon>
                            <h3 className="text-lg font-semibold">{store.storeName}</h3>

                        </CardHeader>
                        <Separator className="mx-autow-full my-2" />
                        <CardContent>
                            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4">
                                <div className="font-medium">Sản phẩm</div>
                                <div className="text-right font-medium">Đơn giá</div>
                                <div className="text-right font-medium">Số lượng</div>
                                <div className="text-right font-medium">Thành tiền</div>


                                {store.items.map((product) => (
                                    <React.Fragment key={product.id}>
                                        <div className="flex items-start gap-4">
                                            <Image
                                                src={product.image || EmptyImage}
                                                alt={product.name}
                                                width={80}
                                                height={80}
                                                className="rounded-md"
                                            />
                                            <div className="space-y-1">
                                                <h4 className="font-medium">{product.name}</h4>
                                                {product.value ? (<p className="text-sm text-muted-foreground">
                                                    Loại: {product.value}
                                                </p>) : null}
                                            </div>
                                        </div>
                                        <div className="text-right">₫{product.salePrice.toLocaleString()}</div>
                                        <div className="text-right">{product.quantity}</div>
                                        <div className="text-right">
                                            ₫{(product.salePrice * product.quantity).toLocaleString()}
                                        </div>
                                    </React.Fragment>
                                ))}

                                <div className="col-span-4 border-t pt-4">
                                    <div className="flex items-start gap-2">
                                        <BaggageClaim id="insurance" />
                                        <div className="grid gap-1.5">

                                            <p className="text-sm text-muted-foreground">
                                                Phương thức vận chuyển{" "}
                                                <span className="text-red-primary hover:underline">
                                                    Cơ bản
                                                </span>
                                            </p>


                                        </div>
                                        <div className="ml-auto text-right">₫24.000</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
                }
            </div>
            <div className="space-y-6 p-4">
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="text-lg font-medium mb-4">Phương thức thanh toán</h3>
                        <RadioGroup
                            defaultValue="cod"
                            onValueChange={setPaymentMethod}
                            className="space-y-4"
                        >
                            <div className="flex items-center space-x-4 rounded-lg border p-4">
                                <RadioGroupItem value="cod" id="cod" />
                                <Label htmlFor="cod" className="flex-1 cursor-pointer">
                                    Thanh toán khi nhận hàng
                                </Label>
                                {paymentMethod === "cod" && (
                                    <div className="text-sm text-muted-foreground">
                                        Phí thu hộ: ₫0 VND. Ưu đãi về phí vận chuyển (nếu có) áp dụng cả với phí thu hộ.
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center space-x-4 rounded-lg border p-4">
                                <RadioGroupItem value="vnpay" id="vnpay" />
                                <Label htmlFor="vnpay" className="flex-1 cursor-pointer">
                                    VN PAY
                                </Label>
                                {paymentMethod === "vnpay" && (
                                    <Image
                                        src={VnPay}
                                        alt="VN PAY"
                                        width={60}
                                        height={40}
                                        className="ml-auto"
                                    />
                                )}
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>

                <div className="space-y-4 px-4 bg-white-primary border-0 rounded-t-xl border-b-[4px] border-red-primary p-3">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tổng tiền hàng</span>
                        <span>₫{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tổng tiền phí vận chuyển</span>
                        <span>₫{shippingFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tổng cộng Voucher giảm giá</span>
                        <span className="text-red-primary">-₫{discount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-medium">
                        <span>Tổng thanh toán</span>
                        <span className="text-red-primary">₫{total.toLocaleString()}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Nhấn "Đặt hàng" đồng nghĩa vớ


                        i việc bạn đồng ý tuân theo{" "}
                        <a href="#" className="text-primary hover:underline">
                            Điều khoản HK Uptech
                        </a>
                    </p>
                    <Button className="w-full" size="lg">
                        Đặt hàng
                    </Button>
                </div>
            </div >
        </div>


    )



}


