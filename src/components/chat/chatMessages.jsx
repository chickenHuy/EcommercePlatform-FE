"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { ChevronLeft, X, Send, Paperclip, MoreVertical, Check, CheckCheck, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Loading from "@/components/loading/index"
import { get } from "@/lib/httpClient"
import Image from "next/image"
import Link from "next/link"
import { ProductInMessage } from "./productInMessage"

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
}) {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)
    const messagesContainerRef = useRef(null)
    const fileInputRef = useRef(null)
    const [products, setProducts] = useState({})
    const [currentPro, setCurrentPro] = useState(null)
    const [discountPercentage, setDiscountPercentage] = useState(0)

    // Load initial messages
    useEffect(() => {
        loadMessages(1)
    }, [room.id])

    useEffect(() => {
        const fetchProduct = async () => {
            if (productId && productId !== "") {
                try {
                    const cur = await get(`/api/v1/products/${productId}`);
                    setCurrentPro(cur.result);
                    setDiscountPercentage(Math.round(((cur.result.originalPrice - cur.result.salePrice) / cur.result.originalPrice) * 100) || 0)
                } catch (error) {
                    console.error("Error fetching product:", error);
                }
            }

        };

        fetchProduct();
    }, [room.id, productId]);

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, websocketMessages])

    // Process websocket messages
    useEffect(() => {
        if (websocketMessages && websocketMessages.length > 0) {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
            }
        }

    }, [websocketMessages])


    // Load messages function
    const loadMessages = async (page) => {
        if (page === 1) {
            setIsLoading(true)
        } else {
            setIsLoadingMore(true)
        }

        setError(null)

        try {
            const response = await fetchMessages(room.id, page, 20)
            const reversedMessages = response.data.slice().reverse();
            if (page === 1) {
                setMessages(reversedMessages)
            } else {
                setMessages((prev) => [...reversedMessages, ...prev])
            }

            setCurrentPage(response.currentPage)
            setHasMore(response.hasNext)
        } catch (err) {
            setError("Failed to load messages")
            console.error(err)
        } finally {
            setIsLoading(false)
            setIsLoadingMore(false)
        }
    }

    useEffect(() => {
        messages.forEach((msg) => {
            if (msg.productId) {
                fetchProduct(msg.productId);
            }
        });
    }, [messages]);

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
                const data = await get(`/api/v1/products/${id}`);
                setProducts((prev) => ({ ...prev, [id]: data.result }));
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm:", error);
            }
        }
    }

    // Load more messages when scrolling to top
    const handleScroll = () => {
        if (messagesContainerRef.current) {
            const { scrollTop } = messagesContainerRef.current

            // If scrolled near the top and we have more messages to load
            if (scrollTop < 50 && hasMore && !isLoadingMore) {
                loadMessages(currentPage + 1)
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

            orderId = ""
            productId = ""

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
            status: "sent",
        })),
    ]

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
                        {
                            isStore ?
                                (<AvatarImage src={room.user_image_url} alt={room.user_name} />)
                                :
                                (<AvatarImage src={room.store_image_url} alt={room.store_name} />)
                        }
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
                {
                    isStore ?
                        (<></>) :
                        (<div className="flex items-center">
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
                        </div >)
                }
            </div >

            {/* Messages */}
            < div
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-blue-primary"
                ref={messagesContainerRef}
                onScroll={handleScroll}
            >
                {/* Loading more indicator */}
                {
                    isLoadingMore && (
                        <div className="flex justify-center py-2">
                            <Loading size="sm" />
                        </div>
                    )
                }

                {/* Error message */}
                {
                    error && (
                        <div className="bg-red-100 text-red-800 p-2 rounded-md text-center">
                            {error}
                            <Button
                                variant="link"
                                className="text-red-800 underline ml-2 p-0 h-auto"
                                onClick={() => loadMessages(currentPage)}
                            >
                                Retry
                            </Button>
                        </div>
                    )
                }

                {/* Loading initial messages */}
                {
                    isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loading />
                        </div>
                    ) : (
                        <>
                            {allMessages.length === 0 ? (
                                <div className="text-center text-gray-tertiary py-8">No messages yet. Start a conversation!</div>
                            ) : (
                                allMessages.map((msg) => (
                                    <> {
                                        msg.productId && msg.productId != "" ?
                                            <ProductInMessage productId={msg.productId} products={products} />
                                            :
                                            null
                                    }
                                        <div key={msg.id} className={cn("flex", ((msg.senderId !== room.user_id && isStore) || (msg.senderId === room.user_id && !isStore)) ? "justify-end" : "justify-start")}>
                                            {(msg.senderId !== room.user_id && !isStore) && (
                                                <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                                                    <AvatarImage
                                                        src={room.store_image_url || "/placeholder.svg?height=40&width=40"}
                                                        alt={room.store_name}
                                                    />
                                                    <AvatarFallback className="bg-black-secondary text-white-primary">
                                                        {room.store_name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )
                                            }
                                            {(msg.senderId == room.user_id && isStore) && (
                                                <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                                                    <AvatarImage
                                                        src={room.user_image_url || "/placeholder.svg?height=40&width=40"}
                                                        alt={room.user_name}
                                                    />
                                                    <AvatarFallback className="bg-black-secondary text-white-primary">
                                                        {room.user_name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )
                                            }
                                            <div className="max-w-[70%]">
                                                <div
                                                    className={cn(
                                                        "p-3 rounded-lg shadow-sm",
                                                        (msg.senderId == room.user_id)
                                                            ? "bg-black-primary text-white-primary rounded-br-none"
                                                            : "bg-white-primary text-black-primary rounded-bl-none border border-gray-tertiary",
                                                    )}
                                                >
                                                    {msg.content}
                                                </div>
                                                <div
                                                    className={cn(
                                                        "text-xs mt-1 flex items-center gap-1",
                                                        (msg.senderId === room.user_id && !isStore) ? "justify-end" : "justify-start",
                                                    )}
                                                >
                                                    <span className="text-gray-tertiary">{formatMessageTime(msg.createdAt)}</span>
                                                    {(msg.senderId === room.user_id && !isStore) && getMessageStatusIcon(msg.status)}
                                                </div>
                                            </div>
                                        </div>
                                    </>)
                                )

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
                        </>
                    )
                }
            </div >

            {/* Message Input */}
            < div className="p-3 border-t border-gray-tertiary bg-white-primary" >
                {
                    currentPro && currentPro != "" ?
                        <div className="flex items-start gap-3 mb-4 p-3 rounded-lg bg-muted/20 border border-border">
                            <div className="flex-shrink-0 relative w-12 h-12 rounded-md overflow-hidden border border-border">
                                <Image
                                    width={68}
                                    height={68}
                                    src={currentPro.mainImageUrl}
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
                                                <span className="text-muted-foreground text-xs line-through">{formatPrice(currentPro.originalPrice)}</span>
                                                <span className="text-xs px-1.5 py-0.5 bg-red-primary text-white-secondary rounded">-{discountPercentage}%</span>
                                            </>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-1.5 text-xs text-muted-foreground">Bạn đang hỏi về sản phẩm này</div>
                            </div>
                        </div> : (<></>)
                }
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
