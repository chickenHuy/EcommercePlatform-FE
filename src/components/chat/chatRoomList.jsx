"use client"

import { useState, useRef } from "react"
import { Search, X, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Loading from "@/components/loading/index"
import { format, formatDistanceToNow } from "date-fns"


export function ChatRoomList({
    rooms,
    onSelectRoom,
    onClose,
    fetchMoreRooms,
    currentPage,
    hasMore,
    isLoadingMore,
    isStore
}) {
    const [searchQuery, setSearchQuery] = useState("")
    const listRef = useRef(null)

    // Filter rooms based on search query
    const filteredRooms = rooms.filter((room) => room.store_name.toLowerCase().includes(searchQuery.toLowerCase()))

    // Handle scroll to load more
    const handleScroll = async () => {
        if (listRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listRef.current

            // If scrolled near the bottom and we have more rooms to load
            if (scrollHeight - scrollTop - clientHeight < 50 && hasMore && !isLoadingMore) {
                try {
                    await fetchMoreRooms(currentPage + 1)
                } catch (error) {
                    console.error("Failed to load more rooms:", error)
                }
            }
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
            console.log("Date value:", date)
            return formatDistanceToNow(date, { addSuffix: true })
        }
    }

    // Total unread count for badge
    const totalUnreadCount = rooms.reduce((total, room) => total + (room.unreadCount || 0), 0)

    return (
        <>
            {/* Rooms List Header */}
            <div className="p-4 bg-black-primary text-white-primary flex justify-between items-center">
                <div className="font-semibold flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    <span>Store Messages</span>
                </div>
                {!isStore &&
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white-primary hover:bg-black-secondary"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                }
            </div>

            {/* Search */}
            <div className="p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-tertiary" />
                    <Input
                        placeholder="Search..."
                        className="pl-9 border text-black-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Rooms List */}
            <div className="flex-1 gap-3 p-3 overflow-y-auto" ref={listRef} onScroll={handleScroll}>
                {filteredRooms.length > 0 ? (
                    filteredRooms.map((room) => (
                        <div
                            key={room.id}
                            className={cn(
                                "flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-primary transition-colors border rounded-md shadow-sm",
                                room.unreadCount ? "bg-blue-primary" : "",
                            )}
                            onClick={() => onSelectRoom(room)}
                        >
                            <div className="relative">
                                {
                                    isStore ? (
                                        <Avatar>
                                            <AvatarImage
                                                src={room.user_image_url || "/placeholder.svg?height=40&width=40"}
                                                alt={room.user_name}
                                            />
                                            <AvatarFallback className="bg-black-secondary text-white-primary">
                                                {room.user_name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <Avatar>
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
                                {/* We could add an online indicator here if the API provides that information */}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <span
                                        className={cn("truncate text-black-primary", room.unreadCount ? "font-semibold" : "")}
                                    >
                                        {isStore ? room.user_name : room.store_name}
                                    </span>
                                    {room.last_time_message && (
                                        <span className="text-xs text-gray-tertiary">{formatMessageTime(room.last_time_message)}</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-tertiary truncate max-w-[180px]">
                                        {room.last_message || "Start a conversation"}
                                    </span>
                                    {room.unreadCount && room.unreadCount > 0 && (
                                        <Badge className="bg-red-primary text-white-primary ml-2">{room.unreadCount}</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center text-gray-tertiary">No stores found matching &quot;{searchQuery}&quot;</div>
                )}

                {/* Loading indicator */}
                {isLoadingMore && (
                    <div className="flex justify-center py-4">
                        <Loading size="sm" />
                    </div>
                )}

                {/* End of list message */}
                {!hasMore && rooms.length > 0 && !isLoadingMore && (
                    <div className="text-center text-gray-tertiary py-2 text-sm">No more conversations</div>
                )}
            </div>
        </>
    )
}

