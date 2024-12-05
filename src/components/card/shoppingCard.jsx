"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "../ui/badge"
import { getTop5CartItems } from "@/api/cart/getTop5CartItem"
import ShopEmpty from "@/assets/images/storeEmpty.jpg"
import { useSelector } from "react-redux"

export default function ShoppingCard() {
    const [cartItems, setCartItems] = useState([])
    const count = useSelector((state) => state.cartReducer.count)

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const data = await getTop5CartItems();
                setCartItems(data.result)
            }
            catch (error) {
                setCartItems([])
            }
        }
        setCartItems([])

        fetchCartData()
    }, [])

    if (cartItems.length === 0) {
        return (
            <Card className="w-[360px] shadow-lg absolute -right-2 top-[calc(100%+8px)] before:content-[''] before:absolute before:top-[-8px] before:right-[18px] before:w-0 before:h-0 before:border-l-[8px] before:border-l-transparent before:border-r-[8px] before:border-r-transparent before:border-b-[8px] before:border-b-white-primary">
                <div className="text-center py-8">
                    <Image
                        src={ShopEmpty}
                        alt="Empty Cart"
                        width={80}
                        height={80}
                        className="mx-auto mb-4"
                    />
                    <p className="text-muted-foreground">Chưa có sản phẩm</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="w-[360px] shadow-lg absolute -right-2 top-[calc(100%+8px)] before:content-[''] before:absolute before:top-[-8px] before:right-[18px] before:w-0 before:h-0 before:border-l-[8px] before:border-l-transparent before:border-r-[8px] before:border-r-transparent before:border-b-[8px] before:border-b-white-primary">
            <div className="p-3 border-b bg-gray-secondary bg-opacity-10">
                <h3 className="text-sm font-medium">Sản Phẩm Mới Thêm</h3>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
                {cartItems.map((item) => (
                    <Link
                        href={`/${item.slug}`}
                        key={item.id}
                        className="flex items-center gap-2 p-2 hover:bg-blue-primary border-b last:border-b-0"
                    >
                        <div className="w-10 h-10 relative flex-shrink-0">
                            <Image
                                src={item.image ? item.image : ShopEmpty}
                                alt={item.name}
                                fill
                                className="object-cover rounded"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm text-black-secondary truncate">
                                {item.name}
                            </h4>
                            <p className="text-sm font-medium text-red-primary mt-1">
                                ₫{item.salePrice.toLocaleString()}
                            </p>
                        </div>
                        {item.value && (<Badge className="text-black-secondary bg-blue-primary shadow-none">
                            {
                                Array.isArray(item.value)
                                    ? item.value.join('|')
                                    : item.value
                            }
                        </Badge>)
                        }
                    </Link>
                ))}
            </div>
            <div className="p-2 bg-gray-secondary bg-opacity-10">
                <div className="font-light text-gray-tertiary mb-3 text-sm">
                    {count} Thêm Vào Giỏ Hàng
                </div>
                <Button
                    className="w-full bg-red-primary hover:bg-red-primary/50 text-white-primary"
                    asChild
                >
                    <Link href="/cart">
                        Xem Giỏ Hàng
                    </Link>
                </Button>
            </div>
        </Card>
    )
}

