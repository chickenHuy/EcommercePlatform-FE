import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { ProductPlaceHoler } from "@/assets/images/productPlaceholder.png";

export default function ProductCard({ listProduct, loadRef, hasNext, loadPage }) {
    const formatPrice = (price) => {
        if (price < 1000000000) {
            return new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(price);
        } else if (price > 1000000000) {
            const priceInMillions = (price / 1000000000).toFixed(1);
            return `≈ ${priceInMillions.replace(".0", "")} tỷ`;
        }
    };

    const formatSold = (sold) => {
        if (sold < 1000) {
            return sold.toString();
        } else if (sold >= 1000 && sold < 1000000) {
            const soldInThousands = (sold / 1000).toFixed(1).replace(".", ",");
            return `${soldInThousands.replace(",0", "")}k`;
        } else if (sold > 1000000) {
            const soldInThousands = (sold / 1000000).toFixed(1).replace(".", ",");
            return `${soldInThousands.replace(",0", "")}tr`;
        }
    };

    return (
        <div className="w-full md:px-20 px-4 pb-4 mt-8">
            <div className="flex flex-col mb-4 space-y-[8px]">
                <Label className="text-3xl font-bold text-center text-red-primary">
                    Sản phẩm gợi ý
                </Label>
                <div className="w-full h-[2px] bg-red-primary bg-opacity-75"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
                {listProduct.map((product) => (
                    <Card
                        key={product.id}
                        className="overflow-hidden hover:scale-105 transition-all duration-300"
                    >
                        <Link href={`/${product.slug}`}>
                            <CardContent className="p-0">
                                <div className="relative aspect-square">
                                    <video
                                        src={product.videoUrl}
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-2 left-2 w-16 h-16 overflow-hidden rounded-md border-[4px] border-white-primary">
                                        <Image
                                            src={product.mainImageUrl || ProductPlaceHoler}
                                            alt={product.name}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                    {product.percentDiscount > 0 && (
                                        <Badge className="absolute top-2 right-2 bg-red-primary">
                                            -{product.percentDiscount}%
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col items-start space-y-[4px] p-[8px]">
                                <Label className="text-sm font-bold line-clamp-2 w-full min-h-[2.5rem] leading-[1.25rem] hover:cursor-pointer">
                                    {product.name}
                                </Label>

                                <div className="flex justify-between items-center w-full hover:cursor-pointer gap-[4px]">
                                    <Label className="text-red-primary text-sm font-bold flex-shrink-0 hover:cursor-pointer">
                                        {formatPrice(product.salePrice)}
                                    </Label>
                                    <Label className="text-xs flex-shrink-0 hover:cursor-pointer">
                                        Đã bán {formatSold(product.sold)}
                                    </Label>
                                </div>
                            </CardFooter>
                        </Link>
                    </Card>
                ))}
            </div>

            {hasNext && <div ref={loadRef} className="w-full h-24"></div>}

            {loadPage && (
                <div className="w-full h-16 flex items-center justify-center">
                    <div className="flex space-x-4">
                        <div className="w-4 h-4 bg-red-primary rounded-full animate-bounce"></div>
                        <div className="w-4 h-4 bg-red-primary rounded-full animate-bounce [animation-delay:-.1s]"></div>
                        <div className="w-4 h-4 bg-red-primary rounded-full animate-bounce [animation-delay:-.5s]"></div>
                    </div>
                </div>
            )}
        </div>
    )
}