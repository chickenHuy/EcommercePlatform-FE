"use client"

import { formatDistanceToNow } from "date-fns"
import { Star, Package, ChevronDown, ChevronUp, Clock } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"


export function OrderChatMessage({ order }) {
  const [showItems, setShowItems] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
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
    <Card className="w-full overflow-hidden">
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

        {/* Store info */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-full overflow-hidden">
            <img
              src={order.avatarStore || "/placeholder.svg"}
              alt={order.storeName}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium">{order.storeName}</p>
            <div className="flex items-center">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs ml-1">{order.ratingStore}</span>
            </div>
          </div>
        </div>

        {/* Shipping info */}
        <div className="mb-3">
          <h4 className="text-sm font-medium mb-1">Shipping Details</h4>
          <p className="text-sm">{order.recipientName}</p>
          <p className="text-sm">{order.orderPhone}</p>
          <p className="text-sm text-muted-foreground">{order.defaultAddressStr}</p>
        </div>

        {/* Payment info */}
        <div className="mb-3">
          <h4 className="text-sm font-medium mb-1">Payment</h4>
          <p className="text-sm">{order.paymentMethod}</p>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatCurrency(order.shippingFee)}</span>
            </div>
            {order.shippingDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Shipping Discount</span>
                <span>-{formatCurrency(order.shippingDiscount)}</span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(order.grandTotal)}</span>
            </div>
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
                  <img
                    src={item.productMainImageUrl || "/placeholder.svg"}
                    alt={item.productName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h5 className="font-medium">{item.productName}</h5>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.values.map((value, index) => (
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
            {order.orderStatusHistories.map((status, index) => (
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
    </Card>
  )
}

