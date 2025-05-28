"use client";
import StoreChatPage from "@/components/chat/pageChat";

export default function ChatPage() {
  return (
    <div className="h-full">
      <StoreChatPage isStore={true} websocketUrl={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ws`} />
    </div>
  );
}

