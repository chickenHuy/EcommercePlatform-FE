"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronUp, ChevronDown, Heart, Share, ShoppingCart, Star, Play, Loader2, Search, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { searchProducts } from "@/api/search/searchApi"
import Link from "next/link"
import { get, post } from "@/lib/httpClient"
import { useDispatch } from "react-redux"
import { setWishList } from "@/store/features/wishListSlice"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import ProductPlaceholder from "@/assets/images/productPlaceholder.png";

function formatPrice(price) {
    const numPrice = typeof price === "string" ? Number.parseFloat(price) : price
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
    }).format(numPrice)
}

function VideoPlayer({ product, isActive }) {
    const videoRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        if (videoRef.current) {
            if (isActive) {
                videoRef.current.play().catch(() => {
                    setIsPlaying(false)
                })
                setIsPlaying(true)
            } else {
                videoRef.current.pause()
                setIsPlaying(false)
            }
        }
    }, [isActive])

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
                setIsPlaying(false)
            } else {
                videoRef.current.play().catch(() => {
                    setIsPlaying(false)
                })
                setIsPlaying(true)
            }
        }
    }

    const handleLoadedData = () => {
        setIsLoading(false)
    }

    return (
        <div className="w-full h-screen flex items-center justify-center bg-black-primary">
            <div className="relative max-w-96 h-[80vh] rounded-sm">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover rounded-sm"
                    loop
                    playsInline
                    poster={product.mainImageUrl}
                    onClick={togglePlay}
                    onLoadedData={handleLoadedData}
                    crossOrigin="anonymous"
                >
                    <source src={product.videoUrl} type="video/mp4" />
                </video>

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black-primary/50">
                        <Loader2 className="w-8 h-8 text-white-primary animate-spin" />
                    </div>
                )}

                {/* Play/Pause Overlay */}
                {!isPlaying && !isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black-primary/20">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="w-20 h-20 rounded-full bg-white-primary/20 backdrop-blur-sm hover:bg-white-primary/30"
                            onClick={togglePlay}
                        >
                            <Play className="w-10 h-10 text-white-primary fill-white-primary" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function TikTokProductViewer({
    initialSize = 10,
    searchPlaceholder = "Tìm kiếm sản phẩm...",
}) {
    const [products, setProducts] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    const [likedProducts, setLikedProducts] = useState(new Set())
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1)
    const [keyword, setKeyword] = useState("")
    const [searchInput, setSearchInput] = useState("")
    const [showSearch, setShowSearch] = useState(false)
    const [error, setError] = useState(null)

    const containerRef = useRef(null)
    const searchTimeoutRef = useRef()

    const currentProduct = products[currentIndex]

    const [showShareDialog, setShowShareDialog] = useState(false)
    const [copySuccess, setCopySuccess] = useState(false)

    const generateShareLink = (product) => {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
        return `${baseUrl}/${product.slug}`
    }

    const handleShare = () => {
        setShowShareDialog(true)
    }

    const handleCopyLink = async () => {
        if (!currentProduct) return

        const shareLink = generateShareLink(currentProduct)

        try {
            await navigator.clipboard.writeText(shareLink)
            setCopySuccess(true)
            setTimeout(() => {
                setCopySuccess(false)
                setShowShareDialog(false)
            }, 1500)
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement("textarea")
            textArea.value = shareLink
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand("copy")
            document.body.removeChild(textArea)

            setCopySuccess(true)
            setTimeout(() => {
                setCopySuccess(false)
                setShowShareDialog(false)
            }, 1500)
        }
    }

    const handleNativeShare = async () => {
        if (!currentProduct) return

        const shareLink = generateShareLink(currentProduct)

        if (navigator.share) {
            try {
                await navigator.share({
                    title: currentProduct.name,
                    text: `Xem sản phẩm ${currentProduct.name} với giá ${formatPrice(currentProduct.salePrice)}`,
                    url: shareLink,
                })
            } catch (err) {
                console.log("Share cancelled or failed")
            }
        } else {
            handleCopyLink()
        }
    }


    const dispatch = useDispatch();

    // Fetch products from API
    const fetchProducts = useCallback(
        async (pageNum, searchKeyword = "", reset = false) => {
            if (loading) return

            setLoading(true)
            setError(null)

            try {
                const data = await searchProducts({
                    search: searchKeyword,
                    page: pageNum,
                    limit: initialSize,
                })


                const newProducts = data.result.data

                if (reset) {
                    setProducts(newProducts)
                    setCurrentIndex(0)
                } else {
                    setProducts((prev) => [...prev, ...newProducts])
                }

                // Check if there are more pages
                const totalPages = data.result.totalPages
                setHasMore(totalPages ? pageNum < totalPages : newProducts.length === initialSize)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu")
                console.error("Error fetching products:", err)
            } finally {
                setLoading(false)
            }
        },
        [initialSize, loading],
    )

    // Initial load
    useEffect(() => {
        fetchProducts(1, keyword, true)
    }, [])

    // Handle search
    const handleSearch = useCallback(
        (searchTerm) => {
            setKeyword(searchTerm)
            setPage(1)
            fetchProducts(1, searchTerm, true)
        },
        [fetchProducts],
    )

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            if (searchInput !== keyword) {
                handleSearch(searchInput)
            }
        }, 500)

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [searchInput, keyword, handleSearch])

    // Load more products when reaching near the end
    const loadMoreProducts = useCallback(() => {
        if (hasMore && !loading && currentIndex >= products.length - 2) {
            const nextPage = page + 1
            setPage(nextPage)
            fetchProducts(nextPage, keyword, false)
        }
    }, [hasMore, loading, currentIndex, products.length, page, keyword, fetchProducts])

    const scrollToIndex = (index) => {
        if (containerRef.current && index >= 0 && index < products.length) {
            const targetScroll = index * window.innerHeight
            containerRef.current.scrollTo({
                top: targetScroll,
                behavior: "smooth",
            })
            setCurrentIndex(index)
        }
    }

    const handleScroll = useCallback(() => {
        if (containerRef.current) {
            const scrollTop = containerRef.current.scrollTop
            const newIndex = Math.round(scrollTop / window.innerHeight)

            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < products.length) {
                setCurrentIndex(newIndex)

                // Update like state based on current product
                const productId = products[newIndex]?.id
                setIsLiked(productId ? likedProducts.has(productId) : false)

                // Load more products if near the end
                if (newIndex >= products.length - 2) {
                    loadMoreProducts()
                }
            }
        }
    }, [currentIndex, products.length, likedProducts, loadMoreProducts])

    const goToPrevious = () => {
        if (currentIndex > 0) {
            scrollToIndex(currentIndex - 1)
        }
    }

    const goToNext = () => {
        if (currentIndex < products.length - 1) {
            scrollToIndex(currentIndex + 1)
        } else {
            loadMoreProducts()
        }
    }

    const toggleLike = async () => {
        if (currentProduct) {
            const newLikedProducts = new Set(likedProducts)
            if (likedProducts.has(currentProduct.id)) {
                newLikedProducts.delete(currentProduct.id)
            } else {
                try {
                    await post(`/api/v1/users/follow/${currentProduct.id}`);
                    get(`/api/v1/users/listFollowedProduct`)
                        .then((res) => {
                            dispatch(setWishList(res.result));
                        })
                        .catch(() => {
                            dispatch(setWishList([]));
                        });
                } catch (error) {
                    console.log("error like product")
                }
                newLikedProducts.add(currentProduct.id)
            }
            setLikedProducts(newLikedProducts)
            setIsLiked(!isLiked)
        }
    }

    useEffect(() => {
        const container = containerRef.current
        if (container) {
            container.addEventListener("scroll", handleScroll)
            return () => container.removeEventListener("scroll", handleScroll)
        }
    }, [handleScroll])

    // Update like state when current product changes
    useEffect(() => {
        if (currentProduct) {
            setIsLiked(likedProducts.has(currentProduct.id))
        }
    }, [currentProduct, likedProducts])

    if (products.length === 0 && loading) {
        return (
            <div className="w-full h-screen bg-black-primary flex items-center justify-center">
                <div className="text-center">
                    <div className="global_loading_icon white"></div>
                </div>
            </div>
        )
    }

    if (products.length === 0 && error) {
        return (
            <div className="w-full h-screen bg-black-primary flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white-primary mb-4">{error}</p>
                    <Button onClick={() => fetchProducts(1, keyword, true)} className="bg-white-primary/20 text-white-primary hover:bg-white-primary/30">
                        Thử lại
                    </Button>
                </div>
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="w-full h-screen bg-black-primary flex items-center justify-center">
                <p className="text-white-primary">Không tìm thấy sản phẩm nào</p>
            </div>
        )
    }

    const discount = currentProduct
        ? Math.round(
            ((Number.parseFloat(currentProduct.originalPrice) - Number.parseFloat(currentProduct.salePrice)) /
                Number.parseFloat(currentProduct.originalPrice)) *
            100,
        )
        : 0

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black-primary">
            {/* Scrollable Video Container */}
            <div
                ref={containerRef}
                className="w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {products.map((product, index) => (
                    <div key={product.id} className="snap-start">
                        <VideoPlayer product={product} isActive={index === currentIndex} />
                    </div>
                ))}

                {/* Loading indicator at the bottom */}
                {loading && hasMore && (
                    <div className="h-screen flex items-center justify-center bg-black-primary">
                        <Loader2 className="w-8 h-8 text-white-primary animate-spin" />
                    </div>
                )}
            </div>

            {/* Fixed UI Overlays */}
            {currentProduct && (
                <>
                    {/* Top Brand Badge */}
                    <div className="absolute top-6 left-6 z-10">
                        <Badge variant="secondary" className="bg-white-primary/20 backdrop-blur-sm text-white-primary border-white-primary/30">
                            {currentProduct.brandName}
                        </Badge>
                    </div>

                    {/* Right Side Actions */}
                    <div className="absolute right-4 bottom-32 flex flex-col gap-4 z-30">
                        <Button
                            size="icon"
                            variant="ghost"
                            className={`w-12 h-12 rounded-full backdrop-blur-sm ${isLiked ? "bg-red-primary/80 text-white-primary" : "bg-white-primary/20 text-white-primary"} hover:bg-white-primary/30`}
                            onClick={toggleLike}
                        >
                            <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
                        </Button>

                        <Button
                            size="icon"
                            variant="ghost"
                            className="w-12 h-12 rounded-full bg-white-primary/20 backdrop-blur-sm text-white-primary hover:bg-white-primary/30"
                            onClick={handleShare}
                        >
                            <Share className="w-6 h-6" />
                        </Button>
                    </div>

                    {/* Navigation Controls */}
                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-20">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="w-10 h-10 rounded-full bg-white-primary/20 backdrop-blur-sm text-white-primary hover:bg-white-primary/30"
                            onClick={goToPrevious}
                            disabled={currentIndex === 0}
                        >
                            <ChevronUp className="w-5 h-5" />
                        </Button>

                        <Button
                            size="icon"
                            variant="ghost"
                            className="w-10 h-10 rounded-full bg-white-primary/20 backdrop-blur-sm text-white-primary hover:bg-white-primary/30"
                            onClick={goToNext}
                            disabled={currentIndex === products.length - 1 && !hasMore}
                        >
                            <ChevronDown className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Progress Indicator */}
                    <div className="absolute left-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-20 max-h-64 overflow-hidden">
                        {products.slice(Math.max(0, currentIndex - 5), currentIndex + 6).map((_, relativeIndex) => {
                            const actualIndex = Math.max(0, currentIndex - 5) + relativeIndex
                            return (
                                <div
                                    key={actualIndex}
                                    className={`w-1 h-6 rounded-full transition-all duration-300 ${actualIndex === currentIndex ? "bg-white-primary" : "bg-white-primary/30"
                                        }`}
                                />
                            )
                        })}
                        {hasMore && <div className="w-1 h-6 rounded-full bg-white-primary/10" />}
                    </div>

                    {/* Bottom Product Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        <div className="bg-gradient-to-t from-black-primary/80 via-black-primary/60 to-transparent-primary pt-8 -mt-8">
                            <div className="space-y-4">
                                <h2 className="text-white-primary text-xl font-bold leading-tight line-clamp-2">{currentProduct.name}</h2>

                                <div className="flex items-center gap-4">
                                    {currentProduct.rating && (
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-primary/80 fill-current" />
                                            <span className="text-white-primary text-sm font-medium">{currentProduct.rating}</span>
                                        </div>
                                    )}
                                    <span className="text-white-primary/80 text-sm">Đã bán: {currentProduct.sold}</span>
                                    <span className="text-white-primary/80 text-sm">Còn lại: {currentProduct.quantity}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-white-primary text-2xl font-bold">{formatPrice(currentProduct.salePrice)}</span>
                                    <span className="text-white-primary/60 text-lg line-through">
                                        {formatPrice(currentProduct.originalPrice)}
                                    </span>
                                    {discount > 0 && (
                                        <Badge variant="destructive" className="bg-red-primary text-white-primary">
                                            -{discount}%
                                        </Badge>
                                    )}
                                </div>

                                <Link href={`/${currentProduct.slug}`} passHref className="w-full h-full relative group">
                                    <Button
                                        className="w-3/4 mx-auto justify-center flex bg-gradient-to-r from-red-primary to-white-primary/80 hover:from-red-600 hover:to-white-primary/70 text-white-primary font-semibold py-3 rounded-full"
                                    >
                                        Xem chi tiết
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )
            }

            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogContent className="bg-black-primary/90 backdrop-blur-md border-white-primary/20 text-white-primary max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-white-primary flex items-center gap-2">
                            <Share className="w-5 h-5" />
                            Chia sẻ sản phẩm
                        </DialogTitle>
                    </DialogHeader>

                    {currentProduct && (
                        <div className="space-y-4">
                            {/* Product Preview */}
                            <div className="flex gap-3 p-3 bg-white-primary/10 rounded-lg">
                                <img
                                    src={currentProduct.mainImageUrl || ProductPlaceholder}
                                    alt={currentProduct.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm line-clamp-2">{currentProduct.name}</h3>
                                    <p className="text-red-primary font-bold text-sm">{formatPrice(currentProduct.salePrice)}</p>
                                </div>
                            </div>

                            {/* Share Link */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Link sản phẩm:</label>
                                <div className="flex gap-2">
                                    <Input
                                        value={generateShareLink(currentProduct)}
                                        readOnly
                                        className="bg-white-primary/10 border-white-primary/20 text-white-primary text-sm"
                                    />
                                    <Button
                                        size="sm"
                                        onClick={handleCopyLink}
                                        className={`px-3 ${copySuccess ? "bg-black-primary hover:bg-red-primary" : "bg-blue-primary hover:bg-blue-primary/80"} text-white`}
                                        disabled={copySuccess}
                                    >
                                        {copySuccess ? (
                                            <>
                                                <Check className="w-4 h-4 mr-1" />
                                                Đã copy
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4 mr-1" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Share Options */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Chia sẻ qua:</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleNativeShare}
                                        className="bg-white-primary/10 border-white-primary/20 text-white-primary hover:bg-white-primary/20"
                                    >
                                        <Share className="w-4 h-4 mr-2" />
                                        Chia sẻ
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCopyLink}
                                        className="bg-white-primary/10 border-white-primary/20 text-white-primary hover:bg-white-primary/20"
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy link
                                    </Button>
                                </div>
                            </div>

                            {/* Social Share Buttons */}
                            <div className="grid grid-cols-3 gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const shareLink = generateShareLink(currentProduct)
                                        const text = `Xem sản phẩm ${currentProduct.name} với giá ${formatPrice(currentProduct.salePrice)}`
                                        window.open(
                                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}&quote=${encodeURIComponent(text)}`,
                                            "_blank",
                                        )
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white"
                                >
                                    Facebook
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const shareLink = generateShareLink(currentProduct)
                                        const text = `Xem sản phẩm ${currentProduct.name} với giá ${formatPrice(currentProduct.salePrice)}`
                                        window.open(
                                            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareLink)}`,
                                            "_blank",
                                        )
                                    }}
                                    className="bg-sky-500 hover:bg-sky-600 border-sky-500 text-white"
                                >
                                    Twitter
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const shareLink = generateShareLink(currentProduct)
                                        const text = `Xem sản phẩm ${currentProduct.name} với giá ${formatPrice(currentProduct.salePrice)} ${shareLink}`
                                        window.open(`https://zalo.me/share/sms?text=${encodeURIComponent(text)}`, "_blank")
                                    }}
                                    className="bg-blue-500 hover:bg-blue-600 border-blue-500 text-white"
                                >
                                    Zalo
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Custom CSS for hiding scrollbar */}
            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div >
    )
}
