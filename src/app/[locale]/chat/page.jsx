"use client";
import WebSocketChat from "@/components/webSocket/chat";

export default function ChatPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      {/* Subcribe vào nhiều room nhưng chỉ gửi tin vào một room */}
      <WebSocketChat roomIds={[
        "c3857813-4e3f-447f-bf61-4b3eab7b479e",
        "room-123",
        "room-456"
      ]} />
    </div>
  );
}

