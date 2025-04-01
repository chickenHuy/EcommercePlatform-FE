import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"


export function ProductInMessage({ productId, products }) {
    const product = products[productId]

    if (!product) return null

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(price)
    }

    return (
        <div className="block mx-auto bg-red-primary/40 rounded-md border">
            <div className="text-xs font-medium text-white-primary mx-1">
                Đoạn tin nhắn đang bàn luận về sản phẩm
            </div>
            <Link
                href={`/${product.slug}`}
                className=
                "bg-white-primary/95 block p-2"
            >
                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 border border-border">
                        <Image
                            width={68}
                            height={68}
                            src={product.mainImageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h5
                            className=
                            "text-xs font-bold line-clamp-1 text-black-primary"

                        >
                            {product.name}
                        </h5>

                        <div className="flex items-center gap-1.5 mt-0.5">

                            <span
                                className="text-xs font-semibold text-black-tertiary"
                            >
                                {formatPrice(product.salePrice)}
                            </span>
                            <span className="text-[10px] text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                        </div>
                        <div className="text-xs font-medium my-auto text-black-tertiary overflow-hidden whitespace-nowrap text-ellipsis">
                            {product.description}
                        </div>
                    </div>

                </div>
            </Link>
        </div>
    )
}

