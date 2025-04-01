"use client"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatRoomList } from "@/components/chat/chatRoomList"
import { ChatMessages } from "@/components/chat/chatMessages"
import { createRoom, listRooms, listMessages } from "@/api/chat/chat"
import useWebSocket from "@/utils/websocket/websocket"

export function StoreChat({ storeId, userId, websocketUrl, isStore, productId, orderId }) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [chatRooms, setChatRooms] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const chatRef = useRef(null)

  // Initialize WebSocket
  const {
    getMessagesByRoom,
    subscribeRoom,
    unsubscribeRoom,
    sendMessage: wsSendMessage,
    connected: wsConnected,
  } = useWebSocket(websocketUrl)

  // Track subscribed rooms
  const subscribedRoomsRef = useRef([])

  // Fetch chat rooms from API
  const fetchChatRooms = async (page = 1) => {
    if (page === 1) {
      setIsLoading(true)
    } else {
      setIsLoadingMore(true)
    }

    setError(null)

    try {
      if (storeId && page === 1) {
        try {
          await createRoom({ storeId })
        } catch (err) {
          console.error("Error creating room:", err)
        }
      }

      // Fetch rooms list
      var response = null
      if (isStore) {
        response = await listRooms("store", page, 10)
        setChatRooms(response.result.data)
      } else {
        response = await listRooms("user", page, 10)
      }

      if (page === 1) {
        setChatRooms(response.result.data)
      } else {
        // Append new rooms to existing list
        setChatRooms((prev) => [...prev, ...response.result.data])
      }

      setCurrentPage(response.result.currentPage)
      setHasMore(response.result.hasNext)

      // If storeId is provided, select that room
      if (storeId && page === 1) {
        const selected = response.result.data.find((room) => room.store_id === storeId)
        if (selected) {
          setSelectedRoom(selected)
        }
      }
    } catch (err) {
      setError("Failed to load chat rooms")
      console.error(err)
    } finally {
      if (page === 1) {
        setIsLoading(false)
      } else {
        setIsLoadingMore(false)
      }
    }
  }

  // Fetch more rooms (pagination)
  const fetchMoreRooms = async (page) => {
    if (isLoadingMore) return
    await fetchChatRooms(page)
  }

  // Fetch messages for a room
  const fetchMessages = async (roomId, page, pageSize) => {
    try {
      if (isStore) {
        const response = await listMessages(roomId, "store", page, pageSize)
        return response.result
      }

      const response = await listMessages(roomId, "user", page, pageSize)
      return response.result
    } catch (err) {
      console.error("Error fetching messages:", err)
      throw err
    }
  }


  // Fetch chat rooms when component mounts
  useEffect(() => {
    if (isChatOpen) {
      fetchChatRooms(1)
    }
  }, [isChatOpen])

  // Subscribe to WebSocket when a room is selected
  useEffect(() => {
    if (selectedRoom && wsConnected) {
      // Subscribe to the selected room
      subscribeRoom(selectedRoom.id)

      // Add to subscribed rooms
      subscribedRoomsRef.current = [...subscribedRoomsRef.current, selectedRoom.id]
    }

    return () => {
      // No cleanup needed here, we'll handle unsubscribing when component unmounts
    }
  }, [selectedRoom, wsConnected])

  // Cleanup WebSocket subscriptions when component unmounts
  useEffect(() => {
    if (isStore) {
      setIsChatOpen(true)
    }
    return () => {
      // Unsubscribe from all rooms
      subscribedRoomsRef.current.forEach((roomId) => {
        unsubscribeRoom(roomId)
      })
    }
  }, [])

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target) && isChatOpen) {
        setIsChatOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isChatOpen])

  // Handle room selection
  const handleSelectRoom = (room) => {
    setSelectedRoom(room)

    // In a real implementation, you would mark messages as read here
    setChatRooms((prevRooms) => prevRooms.map((r) => (r.id === room.id ? { ...r, unreadCount: 0 } : r)))
  }

  // Total unread count for badge
  const totalUnreadCount = chatRooms.reduce((total, room) => total + (room.unreadCount || 0), 0)

  return (
    <div className="relative" ref={chatRef}>
      {/* Chat Button */}
      {
        !isStore ? (<Button variant="ghost" size="icon" className="text-white-primary relative" onClick={() => setIsChatOpen(true)}>
          <MessageCircle className="h-5 w-5" />
          {totalUnreadCount > 0 && (
            <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-red-primary text-[10px] font-bold flex items-center justify-center">
              {totalUnreadCount}
            </div>
          )}
        </Button>
        ) : (<></>)
      }
      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${isStore ? "inset-0 w-screen h-screen" : "top-full right-0 mt-2 w-[380px] sm:w-[450px] h-[550px]"} bg-white-primary shadow-2xl rounded-xl flex flex-col z-40 overflow-hidden border border-gray-tertiary`}
            style={isStore ? {} : { maxHeight: "calc(100vh - 100px)" }}
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
                isLoadingMore={isLoadingMore}
                isStore={isStore}

              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

