import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Cookies from "js-cookie";

const useWebSocket = (baseUrl) => {
    const [client, setClient] = useState(null);
    const [subscriptions, setSubscriptions] = useState({});
    const [roomMessages, setRoomMessages] = useState({});
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        const token = Cookies.get(process.env.NEXT_PUBLIC_JWT_NAME);
        const url = `${baseUrl}?token=${token}`;
        console.log("Connecting to WebSocket at", url);

        const socket = new SockJS(url);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("✅ Connected to WebSocket");
                setConnected(true);

            },
            onDisconnect: () => {
                console.log("❌ Disconnected from WebSocket");
                setConnected(false);
            },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            console.log("🔄 Deactivating WebSocket...");
            stompClient.deactivate();
        };
    }, [baseUrl]);

    /** Subscribe vào một room */
    const subscribeRoom = (roomId) => {
        console.log(`🔗 Subscribing to room ${roomId}`);
        const sub = client.subscribe(`/topic/room/${roomId}`, (message) => {
            try {
                const parsedMessage = JSON.parse(message.body);
                setRoomMessages((prev) => ({
                    ...prev,
                    [roomId]: [...(prev[roomId] || []), parsedMessage],
                }));
            } catch (error) {
                console.error("⚠️ Failed to parse message:", message.body);
            }
        });

        setSubscriptions((prev) => ({ ...prev, [roomId]: sub }));
    };




    /** Unsubscribe khỏi một room */
    const unsubscribeRoom = (roomId) => {
        if (subscriptions[roomId]) {
            console.log(`❌ Unsubscribing from room ${roomId}`);
            subscriptions[roomId].unsubscribe();
            setSubscriptions((prev) => {
                const newSubs = { ...prev };
                delete newSubs[roomId];
                return newSubs;
            });
        }
    };

    /** Gửi tin nhắn vào một room */
    const sendMessage = (roomId, message) => {
        if (client && client.connected) {
            console.log(`📤 Sending message to room ${roomId}:`, message);
            client.publish({
                destination: `/app/chat/${roomId}`,
                body: JSON.stringify(message),
            });
        } else {
            console.error("❌ WebSocket not connected. Cannot send message.");
        }
    };

    /** Lấy danh sách tin nhắn của room */
    const getMessagesByRoom = (roomId) => {
        return roomMessages[roomId] || [];
    };

    return { getMessagesByRoom, subscribeRoom, unsubscribeRoom, sendMessage, connected };
};

export default useWebSocket;
