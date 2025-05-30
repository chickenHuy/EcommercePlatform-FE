"use client"

import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { ChevronLeft, X, Send, Paperclip, MoreVertical, Check, CheckCheck, ShoppingBag, Package, XIcon, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Loading from "@/components/loading/index"
import { get } from "@/lib/httpClient"
import Image from "next/image"
import { ProductInMessage } from "./productInMessage"
import { OrderChatMessage } from "./orderInMessages"
import { useTranslations } from "next-intl"

export function ChatMessages({
    room,
    onBack,
    onClose,
    fetchMessages,
    websocketMessages,
    websocketSendMessage,
    websocketConnected,
    isStore,
    productId,
    orderId,
    order,
    storeOnline,
}) {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)
    const messagesContainerRef = useRef(null)
    const fileInputRef = useRef(null)
    const [products, setProducts] = useState({})
    const [orders, setOrders] = useState({})
    const [currentPro, setCurrentPro] = useState(null)
    const [currentOrder, setCurrentOrder] = useState(null)
    const [discountPercentage, setDiscountPercentage] = useState(0)
    const [initialLoadComplete, setInitialLoadComplete] = useState(false)
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false)
    const [autoScrollDisabled, setAutoScrollDisabled] = useState(true)
    const t = useTranslations("Chat")

    // Load initial messages - only the most recent ones
    useEffect(() => {
        const loadInitialMessages = async () => {
            setIsLoading(true)
            try {
                // Only load the most recent messages (e.g., last 10)
                const result = await fetchMessages(room.id, 1, 10)
                // API returns messages in descending order (newest first)
                // Reverse them to display oldest first
                setMessages([...result.data].reverse())
                setCurrentPage(result.currentPage)
                setHasMore(result.hasNext)
                setInitialLoadComplete(true)
                // Auto-scroll to bottom on initial load
                setAutoScrollDisabled(false)
                setShouldScrollToBottom(true)
            } catch (err) {
                setError("Failed to load messages")
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        if (room.id) {
            loadInitialMessages()
        }

    }, [room.id])

    // Add a new useEffect to ensure we scroll to the bottom after initial load
    useEffect(() => {
        if (initialLoadComplete && messagesEndRef.current && !isLoading) {
            // Use setTimeout to ensure this happens after render
            setTimeout(() => {
                messagesEndRef.current.scrollIntoView({ behavior: "auto" })
            }, 100)
        }
    }, [initialLoadComplete, isLoading])

    useEffect(() => {
        const fetchProduct = async () => {
            if (productId && productId !== "") {
                try {
                    const cur = await get(`/api/v1/products/${productId}`)
                    setCurrentPro(cur.result)
                    setDiscountPercentage(
                        Math.round(((cur.result.originalPrice - cur.result.salePrice) / cur.result.originalPrice) * 100) || 0,
                    )
                } catch (error) {
                    console.error("Error fetching product:", error)
                }
            }
        }

        fetchProduct()
    }, [room.id, productId])

    useEffect(() => {
        const fetchOrder = async () => {
            setCurrentOrder(order)
        }

        fetchOrder()
    }, [room.id, order])

    // Only scroll to bottom for new messages sent by the user or received via websocket
    useEffect(() => {
        if (shouldScrollToBottom && messagesEndRef.current && !autoScrollDisabled) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
            setShouldScrollToBottom(false)
        }
    }, [shouldScrollToBottom, autoScrollDisabled])

    // Process websocket messages
    useEffect(() => {
        if (websocketMessages && websocketMessages.length > 0 && initialLoadComplete) {
            // Check if there are new messages
            const lastMessage = websocketMessages[websocketMessages.length - 1]
            const isNewMessage = !messages.some((m) => m.id === lastMessage.id)

            if (isNewMessage) {
                // Enable auto-scroll for new messages
                setAutoScrollDisabled(false)
                setShouldScrollToBottom(true)
            }
        }
    }, [websocketMessages, messages, initialLoadComplete])

    // Load older messages function
    const loadOlderMessages = async () => {
        if (isLoadingMore || !hasMore) return

        setIsLoadingMore(true)
        try {
            const nextPage = currentPage + 1
            const result = await fetchMessages(room.id, nextPage, 10)

            // API returns messages in descending order (newest first)
            // Reverse them and prepend to the beginning of the messages array
            setMessages((prev) => [...result.data.reverse(), ...prev])
            setCurrentPage(nextPage)
            setHasMore(result.hasNext)
        } catch (err) {
            setError("Failed to load older messages")
            console.error(err)
        } finally {
            setIsLoadingMore(false)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(price)
    }

    const fetchProduct = async (id) => {
        if (!products[id]) {
            try {
                const data = await get(`/api/v1/products/${id}`)
                setProducts((prev) => ({ ...prev, [id]: data.result }))
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm:", error)
            }
        }
    }

    const fetchOrder = async (id) => {
        if (!orders[id]) {
            try {
                var refix = `user`
                if (isStore) {
                    refix = `seller`
                }
                const data = await get(`/api/v1/orders/${id}/${refix}`)
                setOrders((prev) => ({ ...prev, [id]: data.result }))
            } catch (error) {
                console.error("Lỗi khi lấy đơn hàng:", error)
            }
        }
    }

    // Load more messages when scrolling to bottom
    const handleScroll = () => {
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current

            // If scrolled near the top and we have more messages to load
            if (scrollTop < 50 && hasMore && !isLoadingMore) {
                // Save current scroll position
                const currentScrollHeight = messagesContainerRef.current.scrollHeight
                const currentScrollPosition = messagesContainerRef.current.scrollTop

                // Load older messages
                loadOlderMessages().then(() => {
                    // After loading, restore scroll position
                    if (messagesContainerRef.current) {
                        const newScrollHeight = messagesContainerRef.current.scrollHeight
                        const scrollDiff = newScrollHeight - currentScrollHeight
                        messagesContainerRef.current.scrollTop = currentScrollPosition + scrollDiff
                    }
                })
            }

            // Enable auto-scroll when user manually scrolls to the bottom
            if (scrollTop + clientHeight >= scrollHeight - 50) {
                setAutoScrollDisabled(false)
            } else {
                setAutoScrollDisabled(true)
            }
        }
    }

    // Handle file upload click
    const handleFileUploadClick = () => {
        fileInputRef.current?.click()
    }

    // Handle file selection
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const fileName = e.target.files[0].name
            setNewMessage((prev) => (prev ? `${prev} [Attached: ${fileName}]` : `[Attached: ${fileName}]`))
        }
    }

    // Send a message
    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return

        // Create message object
        const messageContent = newMessage.trim()
        setNewMessage("")

        try {
            websocketSendMessage(room.id, {
                content: messageContent,
                orderId: orderId,
                productId: productId,
                isStore,
            })

            // Enable auto-scroll and set flag to scroll to top after sending a message
            setAutoScrollDisabled(false)
            setShouldScrollToBottom(true)

            console.log("Message sent:", orderId, productId, messageContent)
        } catch (err) {
            console.error("Failed to send message:", err)
            // Show error to user
            setError("Failed to send message. Please try again.")
        }
    }

    // Format timestamp
    const formatMessageTime = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const isToday =
            date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()

        if (isToday) {
            return format(date, "HH:mm")
        } else {
            return format(date, "MMM d, HH:mm")
        }
    }

    // Get message status icon
    const getMessageStatusIcon = (status) => {
        switch (status) {
            case "sent":
                return <Check className="h-3 w-3 text-gray-tertiary" />
            case "delivered":
                return <CheckCheck className="h-3 w-3 text-gray-tertiary" />
            case "read":
                return <CheckCheck className="h-3 w-3 text-blue-600" />
            default:
                return null
        }
    }

    // Combine API messages and websocket messages
    const allMessages = [
        ...messages,
        ...websocketMessages.map((msg) => ({
            id: msg.id,
            content: msg.content,
            createdAt: msg.createdAt,
            senderId: msg.senderId,
            productId: msg.productId,
            orderId: msg.orderId,
            status: "sent",
        })),
    ]

    useEffect(() => {
        messages.forEach((msg) => {
            if (msg.productId) {
                fetchProduct(msg.productId)
            }
            if (msg.orderId) {
                fetchOrder(msg.orderId)
            }
        })
    }, [messages])

    useEffect(() => {
        websocketMessages.forEach((msg) => {
            if (msg.productId) {
                fetchProduct(msg.productId)
            }
            if (msg.orderId) {
                fetchOrder(msg.orderId)
            }
        })
    }, [websocketMessages])

    return (
        <>
            {/* Chat Header */}
            <div className="p-4 bg-black-primary text-white-primary flex justify-between items-center border-b border-black-tertiary">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white-primary mr-1 hover:bg-black-secondary"
                        onClick={onBack}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-8 w-8 border-2 border-white-primary">
                        {isStore ? (
                            <AvatarImage src={room.user_image_url || "/placeholder.svg"} alt={room.user_name} />
                        ) : (
                            <AvatarImage src={room.store_image_url || "/placeholder.svg"} alt={room.store_name} />
                        )}
                        <AvatarFallback className="bg-black-secondary text-white-primary">
                            {isStore ? room.user_name.charAt(0) : room.store_name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{isStore ? room.user_name : room.store_name}</div>
                        <div className="text-xs flex items-center">
                            {websocketConnected ? (
                                <>
                                    <span className="h-2 w-2 rounded-full bg-green-500 inline-block mr-1"></span>
                                    Online
                                </>
                            ) : (
                                <>
                                    <span className="h-2 w-2 rounded-full bg-gray-tertiary inline-block mr-1"></span>
                                    Offline
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {isStore ? (
                    <></>
                ) : (
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white-primary hover:bg-black-secondary">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white-primary hover:bg-black-secondary"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Messages */}
            {
                <div
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-blue-primary"
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                >
                    {/* Loading more indicator - now at the top */}
                    {isLoadingMore && (
                        <div className="flex justify-center py-2">
                            <Loading size="sm" />
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-100 text-red-800 p-2 rounded-md text-center">
                            {error}
                            <Button
                                variant="link"
                                className="text-red-800 underline ml-2 p-0 h-auto"
                                onClick={() => loadOlderMessages()}
                            >
                                {t("retry")}
                            </Button>
                        </div>
                    )}

                    {/* Loading initial messages */}
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loading />
                        </div>
                    ) : (
                        allMessages.map((msg) => (
                            <div key={msg.id} cl>
                                {msg.productId && msg.productId != "" ? (
                                    <ProductInMessage productId={msg.productId} products={products} />
                                ) : null}

                                {msg.orderId && msg.orderId != "" ? (
                                    <OrderChatMessage orderId={msg.orderId} orders={orders} />
                                ) : null}
                                <div
                                    className={cn(
                                        "flex", "my-2",
                                        (msg.senderId !== room.user_id && isStore) || (msg.senderId === room.user_id && !isStore)
                                            ? "justify-end"
                                            : "justify-start",
                                    )}
                                >
                                    {msg.senderId !== room.user_id && !isStore && (
                                        <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                                            <AvatarImage
                                                src={room.store_image_url || "/placeholder.svg?height=40&width=40"}
                                                alt={room.store_name}
                                            />
                                            <AvatarFallback className="bg-black-secondary text-white-primary">
                                                {room.store_name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    {msg.senderId == room.user_id && isStore && (
                                        <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                                            <AvatarImage
                                                src={room.user_image_url || "/placeholder.svg?height=40&width=40"}
                                                alt={room.user_name}
                                            />
                                            <AvatarFallback className="bg-black-secondary text-white-primary">
                                                {room.user_name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className="max-w-[70%]">
                                        <div
                                            className={cn(
                                                "p-3 rounded-lg shadow-sm",
                                                msg.senderId == room.user_id
                                                    ? "bg-black-primary text-white-primary rounded-br-none"
                                                    : "bg-white-primary text-black-primary rounded-bl-none border border-gray-tertiary",
                                            )}
                                        >
                                            {msg.content}
                                        </div>
                                        <div
                                            className={cn(
                                                "text-xs mt-1 flex items-center gap-1",
                                                msg.senderId === room.user_id && !isStore ? "justify-end" : "justify-start",
                                            )}
                                        >
                                            <span className="text-gray-tertiary">{formatMessageTime(msg.createdAt)}</span>
                                            {msg.senderId === room.user_id && !isStore && getMessageStatusIcon(msg.status)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )))
                    }

                    {(storeOnline && allMessages.length === 0) && (
                        <p className="flex justify-center">{t("start_chat_seller")}</p>
                    )}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <Avatar className="h-8 w-8 mr-2 mt-1">
                                <AvatarImage
                                    src={room.store_image_url || "/placeholder.svg?height=40&width=40"}
                                    alt={room.store_name}
                                />
                                <AvatarFallback className="bg-black-secondary text-white-primary">
                                    {room.store_name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="bg-white-primary p-3 rounded-lg shadow-sm border border-gray-tertiary rounded-bl-none">
                                <div className="flex space-x-1">
                                    <div
                                        className="h-2 w-2 rounded-full bg-gray-tertiary animate-bounce"
                                        style={{ animationDelay: "0ms" }}
                                    ></div>
                                    <div
                                        className="h-2 w-2 rounded-full bg-gray-tertiary animate-bounce"
                                        style={{ animationDelay: "150ms" }}
                                    ></div>
                                    <div
                                        className="h-2 w-2 rounded-full bg-gray-tertiary animate-bounce"
                                        style={{ animationDelay: "300ms" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div >
            }

            {/* Message Input */}
            <div className="p-3 border-t border-gray-tertiary bg-white-primary">
                {currentPro && currentPro != "" ? (
                    <div className="flex items-start gap-3 mb-4 p-3 rounded-lg bg-muted/20 border border-border">
                        <div className="flex-shrink-0 relative w-12 h-12 rounded-md overflow-hidden border border-border">
                            <Image
                                width={68}
                                height={68}
                                src={currentPro.mainImageUrl || "/placeholder.svg"}
                                alt={currentPro.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h4 className="font-bold text-sm line-clamp-2 text-foreground">{currentPro.name}</h4>

                                    <div className="mt-1 flex items-center gap-2">
                                        <>
                                            <span className="text-black-primary font-semibold">{currentPro.salePrice}</span>
                                            <span className="text-muted-foreground text-xs line-through">
                                                {formatPrice(currentPro.originalPrice)}
                                            </span>
                                            <span className="text-xs px-1.5 py-0.5 bg-red-primary text-white-secondary rounded">
                                                -{discountPercentage}%
                                            </span>
                                        </>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-1.5 text-xs text-muted-foreground">{t("asking_product")}</div>
                        </div>

                        {/* Nút đóng */}
                        <XIcon className="text-black-primary h-4 w-4 bg-blue-primary rounded-sm"
                            onClick={() => {
                                setCurrentPro(null)
                            }}>
                        </XIcon>

                    </div>
                ) : (
                    <></>
                )}
                {currentOrder && orderId !== "" ? (
                    <div className="mb-4 rounded-lg border border-border shadow-sm hover:shadow transition-shadow duration-200 overflow-hidden">
                        {/* Order header */}
                        <div className="p-3 bg-muted/30 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-sm">{t("order")} #{currentOrder.id}</span>
                            </div>
                            {/* Nút đóng */}
                            <XIcon className="text-black-primary h-4 w-4 bg-blue-primary rounded-sm"
                                onClick={() => {
                                    setCurrentOrder(null)
                                }}>
                            </XIcon>
                        </div>

                        {/* Order items */}
                        <div className="p-3">
                            {/* Display first item with more details */}
                            {currentOrder.orderItems && currentOrder.orderItems.length > 0 && (
                                <div className="flex items-start gap-3 mb-2">
                                    <div className="flex-shrink-0 relative w-16 h-16 rounded-md overflow-hidden border border-border">
                                        <Image
                                            width={80}
                                            height={80}
                                            src={currentOrder.orderItems[0].productMainImageUrl || "/placeholder.svg"}
                                            alt={currentOrder.orderItems[0].productName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm line-clamp-2 text-foreground">
                                            {currentOrder.orderItems[0].productName}
                                        </h4>

                                        {currentOrder.orderItems[0].values && order.orderItems[0].values.length > 0 && (
                                            <div className="mt-1 text-xs text-muted-foreground">
                                                {t("classify")} {currentOrder.orderItems[0].values.join(", ")}
                                            </div>
                                        )}

                                        <div className="mt-1 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">
                                                    {formatPrice(currentOrder.orderItems[0].price - currentOrder.orderItems[0].discount)}
                                                </span>
                                                {currentOrder.orderItems[0].discount > 0 && (
                                                    <span className="text-xs text-muted-foreground line-through">
                                                        {formatPrice(currentOrder.orderItems[0].price)}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-muted-foreground">x{currentOrder.orderItems[0].quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Show thumbnails of additional items */}
                            {order.orderItems && order.orderItems.length > 1 && (
                                <div className="mt-3">
                                    <div className="flex items-center gap-1 mb-2">
                                        <Package className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                            {t("order_in_order", { itemsLength: order.orderItems.length - 1 })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {order.orderItems.slice(1, 5).map((item, index) => (
                                            <div
                                                key={index}
                                                className="w-10 h-10 rounded-md overflow-hidden border border-border relative flex-shrink-0"
                                            >
                                                <Image
                                                    width={40}
                                                    height={40}
                                                    src={item.productMainImageUrl || "/placeholder.svg"}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                                {item.quantity > 1 && (
                                                    <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] px-1 rounded-tl-sm">
                                                        x{item.quantity}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {order.orderItems.length > 5 && (
                                            <div className="w-10 h-10 rounded-md border border-border flex items-center justify-center bg-muted/30 text-xs">
                                                +{order.orderItems.length - 5}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order summary */}
                        <div className="p-3 bg-muted/20 border-t border-border">
                            <div className="flex items-center justify-between">
                                <span className="text-base font-bold text-red-600">{formatPrice(order.grandTotal)}</span>
                                <span className={`px-2 py-0.5 text-xs rounded-full text-white`}>
                                    {order.paymentMethod}
                                </span>
                                <span className={`px-2 py-0.5 text-xs rounded-full text-white`}>
                                    {order.currentStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
                <div className="flex gap-2 items-end">
                    <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 min-h-[60px] max-h-[120px] resize-none border-gray-tertiary text-black-primary"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSendMessage()
                            }
                        }}
                    />
                    <div className="flex flex-col gap-2">
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-gray-tertiary text-black-primary hover:bg-gray-primary"
                            onClick={handleFileUploadClick}
                        >
                            <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button
                            className="h-9 w-9 bg-black-primary text-white-primary hover:bg-black-secondary"
                            size="icon"
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div >
        </>
    )
}
