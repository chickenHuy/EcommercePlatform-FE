"use client"

import { useState, useEffect } from "react"
import { ChatRoomList } from "@/components/chat/chatRoomList"
import { ChatMessages } from "@/components/chat/chatMessages"
import { listRooms, listMessages } from "@/api/chat/chat"
import useWebSocket from "@/utils/websocket/websocket"
import { Portal } from "./portal"
import { AnimatePresence, motion } from 'framer-motion'

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
            const response = await listMessages(roomId, isStore ? 'store' : 'user', page, pageSize)
            return response.result
        } catch (err) {
            console.error('Error fetching messages:', err)
            throw err
        }
    }

    const handleSelectRoom = (room) => {
        setSelectedRoom(room)
    }

    return (
        <div className="container mx-auto p-4 mt-20">
            <h1 className="text-2xl font-bold mb-4">Chat</h1>
            <div className="border rounded-lg p-4 bg-white shadow overflow-y-auto">
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

            {selectedRoom ? <Portal>
                <div className="fixed inset-0 z-50 pointer-events-none">
                    <div className="w-full h-full flex items-end justify-end p-4 pointer-events-none">
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className={`${isStore
                                    ? 'fixed inset-0 w-screen h-screen'
                                    : 'w-[380px] sm:w-[450px] h-[550px]'
                                    } bg-white-primary shadow-2xl rounded-xl flex flex-col overflow-hidden border border-gray-tertiary pointer-events-auto`}
                                style={isStore ? {} : { maxHeight: 'calc(100vh - 100px)' }}
                            >
                                {isLoading ? (
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black-primary"></div>
                                    </div>
                                ) : error ? (
                                    <div className="flex-1 flex items-center justify-center text-red-primary p-4 text-center">
                                        {error}
                                        <Button variant="outline" className="mt-2" onClick={() => fetchChatRooms(1)}>
                                            Retry
                                        </Button>
                                    </div>
                                ) : selectedRoom ? (
                                    <ChatMessages
                                        room={selectedRoom}
                                        userId={userId}
                                        onBack={() => setSelectedRoom(null)}
                                        onClose={() => setIsChatOpen(false)}
                                        fetchMessages={fetchMessages}
                                        websocketMessages={getMessagesByRoom(selectedRoom.id)}
                                        websocketSendMessage={wsSendMessage}
                                        websocketConnected={wsConnected}
                                        isStore={isStore}
                                        productId={productId}
                                        orderId={orderId}
                                    />
                                ) : (
                                    <ChatRoomList
                                        rooms={chatRooms}
                                        onSelectRoom={handleSelectRoom}
                                        onClose={() => setIsChatOpen(false)}
                                        fetchMoreRooms={fetchMoreRooms}
                                        currentPage={currentPage}
                                        hasMore={hasMore}
                                        isStore={isStore}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </Portal> : null
            }
        </div>
    )
}