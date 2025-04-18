'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Portal } from '@/components/chat/portal'
import { ChatRoomList } from '@/components/chat/chatRoomList'
import { ChatMessages } from '@/components/chat/chatMessages'
import { createRoom, listRooms, listMessages } from '@/api/chat/chat'
import useWebSocket from '@/utils/websocket/websocket'

export function StoreChat({
  storeId,
  userId,
  websocketUrl,
  isStore,
  productId,
  orderId,
  setProductId,
}) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [chatRooms, setChatRooms] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const chatRef = useRef(null)

  const {
    getMessagesByRoom,
    subscribeRoom,
    unsubscribeRoom,
    sendMessage: wsSendMessage,
    connected: wsConnected,
  } = useWebSocket(websocketUrl)

  const subscribedRoomsRef = useRef([])

  const fetchChatRooms = async (page = 1) => {
    if (page === 1) setIsLoading(true)
    else setIsLoadingMore(true)

    setError(null)
    try {
      if (storeId && page === 1) {
        try {
          await createRoom({ storeId })
        } catch (err) {
          console.error('Error creating room:', err)
        }
      }

      let response = null
      if (isStore) {
        response = await listRooms('store', page, 10)
      } else {
        response = await listRooms('user', page, 10)
      }

      if (page === 1) {
        setChatRooms(response.result.data)
      } else {
        setChatRooms((prev) => [...prev, ...response.result.data])
      }

      setCurrentPage(response.result.currentPage)
      setHasMore(response.result.hasNext)

      if (storeId && page === 1) {
        const selected = response.result.data.find((room) => room.store_id === storeId)
        if (selected) {
          setSelectedRoom(selected)
        }
      }
    } catch (err) {
      setError('Failed to load chat rooms')
      console.error(err)
    } finally {
      if (page === 1) setIsLoading(false)
      else setIsLoadingMore(false)
    }
  }

  const fetchMoreRooms = async (page) => {
    if (isLoadingMore) return
    await fetchChatRooms(page)
  }

  const fetchMessages = async (roomId, page, pageSize) => {
    try {
      const response = await listMessages(roomId, isStore ? 'store' : 'user', page, pageSize)
      return response.result
    } catch (err) {
      console.error('Error fetching messages:', err)
      throw err
    }
  }

  useEffect(() => {
    if (isChatOpen) {
      fetchChatRooms(1)
    }
  }, [isChatOpen])

  useEffect(() => {
    if (selectedRoom && wsConnected) {
      subscribeRoom(selectedRoom.id)
      subscribedRoomsRef.current = [...subscribedRoomsRef.current, selectedRoom.id]
    }
  }, [selectedRoom, wsConnected])

  useEffect(() => {
    if (isStore) {
      setIsChatOpen(true)
    }
    return () => {
      subscribedRoomsRef.current.forEach((roomId) => {
        unsubscribeRoom(roomId)
      })
    }
  }, [])

  const handleClickOutside = (event) => {
    if (chatRef.current && !chatRef.current.contains(event.target) && isChatOpen) {
      setIsChatOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isChatOpen])

  const handleSelectRoom = (room) => {
    setSelectedRoom(room)
    setChatRooms((prev) =>
      prev.map((r) => (r.id === room.id ? { ...r, unreadCount: 0 } : r)),
    )
  }

  const totalUnreadCount = chatRooms.reduce((total, room) => total + (room.unreadCount || 0), 0)

  return (
    <div className="relative">
      {!isStore ? (
        productId !== '' ? (
          <Button variant="outline" className="mt-4 mr-auto" onClick={() => setIsChatOpen(true)}>
            <MessageCircle className="h-5 w-5" />
            Hỏi về sản phẩm
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="text-black-primary relative"
            onClick={() => setIsChatOpen(true)}
          >
            <MessageCircle className="h-5 w-5" />
            {totalUnreadCount > 0 && (
              <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-red-primary text-[10px] font-bold flex items-center justify-center">
                {totalUnreadCount}
              </div>
            )}
          </Button>
        )
      ) : null}

      {isChatOpen && (
        <Portal>
          <div className="fixed inset-0 z-50 pointer-events-none">
            <div className="w-full h-full flex items-end justify-end p-4 pointer-events-none">
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  ref={chatRef}
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
                      setProductId={setProductId}
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
              </AnimatePresence>
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}

