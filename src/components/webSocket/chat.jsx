"use client";
import { useState, useEffect, useRef } from "react";
import useWebSocket from "@/utils/websocket/websocket";
import { MessageCircle, Send } from "lucide-react";

const WebSocketChat = ({ roomIds }) => {
  const { getMessagesByRoom, subscribeRoom, unsubscribeRoom, sendMessage, connected } = useWebSocket("http://localhost:8080/api/v1/ws");
  const [input, setInput] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(roomIds[0]);
  // Sử dụng ref để lưu danh sách room đã subscribe hiện tại
  const currentRoomIdsRef = useRef([]);
  const chatBoxRef = useRef(null);


  useEffect(() => {
    if (!connected) return;

    // Lấy danh sách room hiện tại và danh sách room mới được truyền vào
    const prevRooms = currentRoomIdsRef.current;
    const newRooms = roomIds.filter(roomId => !prevRooms.includes(roomId));
    const removedRooms = prevRooms.filter(roomId => !roomIds.includes(roomId));

    // Subscribe vào các room mới
    newRooms.forEach((roomId) => {
      console.log("Subscribing to new room:", roomId);
      subscribeRoom(roomId);
    });

    // Unsubscribe khỏi các room đã bị loại bỏ
    removedRooms.forEach((roomId) => {
      console.log("Unsubscribing from removed room:", roomId);
      unsubscribeRoom(roomId);
    });

    // Cập nhật currentRoomIdsRef
    currentRoomIdsRef.current = roomIds;
  }, [roomIds, connected, subscribeRoom, unsubscribeRoom]);

  const handleSend = () => {
    if (input.trim() !== "") {
      sendMessage(selectedRoom, { content: input, orderId: "123", productId: "456" });
      setInput("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-lg rounded-2xl border">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <MessageCircle size={24} />
        WebSocket Chat
      </h2>

      {/* Dropdown chọn phòng chat */}
      <select
        className="border p-2 w-full mt-3 rounded-lg focus:ring-2 focus:ring-blue-500"
        value={selectedRoom}
        onChange={(e) => setSelectedRoom(e.target.value)}
      >
        {roomIds.map((roomId) => (
          <option key={roomId} value={roomId}>
            Room {roomId}
          </option>
        ))}
      </select>

      {/* Hiển thị tin nhắn */}
      <div
        ref={chatBoxRef}
        className="border p-2 h-56 overflow-auto bg-gray-50 mt-3 rounded-lg flex flex-col space-y-2"
      >
        {getMessagesByRoom(selectedRoom).map((msg, index) => (
          <div key={index} className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full text-white flex items-center justify-center font-bold">
              {msg.content.charAt(0).toUpperCase()}
            </div>
            <div className="bg-blue-100 px-3 py-2 rounded-lg shadow-sm">
              <strong className="text-blue-700">Room {selectedRoom}:</strong> {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input gửi tin nhắn */}
      <div className="flex mt-3 gap-2">
        <input
          type="text"
          className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
          onClick={handleSend}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};


export default WebSocketChat;
