"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Minus, ShoppingCart } from 'lucide-react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Băng bảo vệ cổ tay tránh chấn thương",
      price: 44000,
      quantity: 1,
      image: "/placeholder.svg"
    },
    {
      id: "2",
      name: "Tập hợp 7 loại protein chất lượng",
      price: 1265000,
      quantity: 1,
      image: "/placeholder.svg"
    },
    {
      id: "3",
      name: "Sữa tăng cơ Rule 1 Whey Blend",
      price: 1265000,
      quantity: 1,
      image: "/placeholder.svg"
    }
  ])

  const updateQuantity = (id: string, increment: boolean) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: increment ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
          : item
      )
    )
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  if (cartItems.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto p-6 bg-white">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-24 h-24 relative">
            <Image
              src="/placeholder.svg"
              alt="Empty Cart"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-lg font-medium text-gray-900">Chưa Có Sản Phẩm</h2>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Sản Phẩm Mới Thêm
        </h2>
      </div>
      <div className="divide-y">
        {cartItems.map((item) => (
          <div key={item.id} className="p-4 flex gap-4">
            <div className="w-16 h-16 relative flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </h3>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-sm font-medium text-[#ee4d2d]">
                  ₫{item.price.toLocaleString()}
                </p>
                <div className="flex items-center border rounded">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, false)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-10 text-center text-sm">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, true)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">{totalItems} Thêm Hàng Vào Giỏ</span>
          <span className="text-lg font-medium text-[#ee4d2d]">₫{totalPrice.toLocaleString()}</span>
        </div>
        <Button 
          className="w-full bg-[#ee4d2d] hover:bg-[#d73211] text-white"
        >
          Xem Giỏ Hàng
        </Button>
      </div>
    </Card>
  )
}

