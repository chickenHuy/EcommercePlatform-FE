"use client"

import { useState, useEffect } from "react"
import { ChatRoomList } from "@/components/chat/chatRoomList"
import { ChatMessages } from "@/components/chat/chatMessages"
import { listRooms, listMessages } from "@/api/chat/chat"
import useWebSocket from "@/utils/websocket/websocket"

export default function StoreChatPage({ storeId, userId, websocketUrl, isStore, productId, orderId }) {
    const [selectedRoom, setSelectedRoom] = useState(null)
    const [chatRooms, setChatRooms] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)

    const { getMessagesByRoom, subscribeRoom,
        unsubscribeRoom, sendMessage: wsSendMessage, connected: wsConnected } = useWebSocket(websocketUrl)

    useEffect(() => {
        const fetchChatRooms = async (page = 1) => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await listRooms(isStore ? "store" : "user", page, 10)
                setChatRooms(response.result.data)
                setCurrentPage(response.result.currentPage)
                setHasMore(response.result.hasNext)
            } catch (err) {
                setError("Failed to load chat rooms")
            } finally {
                setIsLoading(false)
            }
        }

        fetchChatRooms(1)
    }, [])

    useEffect(() => {
        if (selectedRoom && wsConnected) {
            subscribeRoom(selectedRoom.id)
        }
        return () => {
            if (selectedRoom) unsubscribeRoom(selectedRoom.id)
        }
    }, [selectedRoom, wsConnected])

    const fetchMessages = async (roomId, page, pageSize) => {
        try {
            const response = await listMessages(roomId, isStore ? "store" : "user", page, pageSize)
            return response.result
        } catch (err) {
            console.error("Error fetching messages:", err)
            throw err
        }
    }

    const handleSelectRoom = (room) => {
        setSelectedRoom(room)
    }

    return (
        <div className="container mx-auto p-4 mt-20">
            <h1 className="text-2xl font-bold mb-4">Chat</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 border rounded-lg p-4 bg-white shadow max-h-[80svh] overflow-y-auto">
                    {isLoading ? (
                        <p>Loading chat rooms...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <ChatRoomList
                            rooms={chatRooms}
                            onSelectRoom={handleSelectRoom}
                            fetchMoreRooms={() => { }}
                            currentPage={currentPage}
                            hasMore={hasMore}
                            isLoadingMore={false}
                            isStore={isStore}
                        />
                    )}
                </div>
                <div className="md:col-span-2 border rounded-lg p-4 bg-white shadow max-h-[80svh] overflow-y-auto">
                    {selectedRoom ? (
                        <ChatMessages
                            room={selectedRoom}
                            userId={userId}
                            onBack={() => setSelectedRoom(null)}
                            fetchMessages={fetchMessages}
                            websocketMessages={getMessagesByRoom(selectedRoom.id)}
                            websocketSendMessage={wsSendMessage}
                            websocketConnected={wsConnected}
                            isStore={isStore}
                            productId={productId}
                            orderId={orderId}
                        />
                    ) : (
                        <p>Select a chat room to view messages</p>
                    )}
                </div>
            </div>
        </div>
    )
}