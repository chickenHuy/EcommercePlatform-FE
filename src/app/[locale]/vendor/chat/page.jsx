"use client";
import StoreChatPage from "@/components/chat/pageChat";

export default function ChatPage() {
  return (
    <div className="h-full">
      <StoreChatPage isStore={true} websocketUrl={"http://localhost:8080/api/v1/ws"} />
    </div>
  );
}

