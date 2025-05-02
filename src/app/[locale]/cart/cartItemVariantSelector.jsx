"\"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Settings2 } from "lucide-react"

export function CartItemVariantSelector(cartItemId) {
  const [selectedAttributes, setSelectedAttributes] = useState({})
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(0)
  const [open, setOpen] = useState(false)
  const [product, setProduct] = useState(null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Thay đổi</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Đổi loại sản phẩm</h4>
          </div>

          {product?.attributes?.map((attribute) => (
            <div key={attribute.id} className="space-y-2">
              <h5 className="text-sm font-medium">{attribute.name}</h5>
              <div className="flex flex-wrap gap-2">
                {attribute.values.map((value) => (
                  <Button
                    key={value.id}
                    size="sm"
                    variant={selectedAttributes[attribute.name] === value.value ? "default" : "outline"}
                    onClick={() => handleAttributeSelect(attribute.name, value.value)}
                    disabled={isAttributeDisabled(attribute.name, value.value)}
                  >
                    {value.value}
                  </Button>
                ))}
              </div>
            </div>
          ))}
          <Button
            // onClick={}
            disabled={!selectedVariant && product?.variants?.length > 0}
            className="bg-red-primary hover:bg-red-600"
          >
            Cập nhật giỏ hàng
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
