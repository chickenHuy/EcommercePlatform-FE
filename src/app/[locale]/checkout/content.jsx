import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { BaggageClaim, MessageCircle } from 'lucide-react'
import Image from "next/image"
import React from "react"

const stores = [
    {
        id: "1",
        name: "bodybuilding_vietnam",
        products: [
            {
                id: "1",
                name: "Sữa tăng cơ Rule 1 Whey Blend 5lb",
                variant: "Cafe Mocha",
                price: 1265000,
                quantity: 1,
                image: "/placeholder.svg?height=80&width=80"
            },
            {
                id: "2",
                name: "Sữa tăng cơ Rule 1 Whey Blend gói",
                variant: "2 samples",
                price: 50000,
                quantity: 1,
                image: "/placeholder.svg?height=80&width=80"
            }
        ]
    }
]

export default function CheckoutContent() {



    return (
        <div className="space-y-6 px-4">
            {stores.map((store) => (
                <Card key={store.id}>
                    <CardHeader className="flex-row items-center gap-4 pb-2">
                        <Badge variant="default" className="h-6 w-6 rounded-sm p-0 font-bold">
                            Hot
                        </Badge>
                        <h3 className="text-lg font-semibold">{store.name}</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4">
                            <div className="font-medium">Sản phẩm</div>
                            <div className="text-right font-medium">Đơn giá</div>
                            <div className="text-right font-medium">Số lượng</div>
                            <div className="text-right font-medium">Thành tiền</div>

                            {store.products.map((product) => (
                                <React.Fragment key={product.id}>
                                    <div className="flex items-start gap-4">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            width={80}
                                            height={80}
                                            className="rounded-md"
                                        />
                                        <div className="space-y-1">
                                            <h4 className="font-medium">{product.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Loại: {product.variant}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">₫{product.price.toLocaleString()}</div>
                                    <div className="text-right">{product.quantity}</div>
                                    <div className="text-right">
                                        ₫{(product.price * product.quantity).toLocaleString()}
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
            ))}
        </div>
    )

}

