"use client"

import { formatDistanceToNow } from "date-fns"
import { Package, ChevronDown, ChevronUp, Clock } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ProductPlaceholder from "@/assets/images/productPlaceholder.png"
import Link from "next/link"

export function OrderChatMessage({ orderId, orders }) {
  const [showItems, setShowItems] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (!orders) return
    setOrder(orders[orderId])
  }, [orders])

  const formatCurrency = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return dateString
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <> {order && (<Card className="w-full overflow-hidden">
      <div className="p-4">
        {/* Order header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Order {order.id}</h3>
              <Badge className={getStatusColor(order.currentStatus)}>{order.currentStatus}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              <Clock className="inline-block w-3 h-3 mr-1" />
              {formatDate(order.lastUpdatedAt)}
            </p>
          </div>
        </div>

        {/* Order items toggle */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between mt-2"
          onClick={() => setShowItems(!showItems)}
        >
          <span className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            {order.orderItems.length} Items
          </span>
          {showItems ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {/* Order items */}
        {showItems && (
          <div className="mt-3 space-y-3">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    width={68}
                    height={68}
                    src={item.productMainImageUrl ? item.productMainImageUrl : ProductPlaceholder}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Link href={`/${item.productSlug}`} className="font-medium">
                    {item.productName}
                  </Link>

                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.values?.map((value, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {value}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm">
                      {formatCurrency(item.price - item.discount)} × {item.quantity}
                    </span>
                    <span className="font-medium">{formatCurrency((item.price - item.discount) * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order history toggle */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between mt-3"
          onClick={() => setShowHistory(!showHistory)}
        >
          <span className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Order History
          </span>
          {showHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {/* Order history */}
        {showHistory && (
          <div className="mt-3 space-y-2">
            {order.orderStatusHistories?.map((status, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{status.orderStatusName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(status.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>)}
    </>
  )
}

