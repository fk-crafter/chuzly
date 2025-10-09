import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { io, Socket } from "socket.io-client";
import { API_URL } from "../config";

type Message = {
  id: string;
  content: string;
  nickname?: string;
  user?: { name: string };
  createdAt?: string;
};

type Props = {
  eventId: string;
  nickname?: string;
  userId?: string;
};

export default function ChatBox({ eventId, nickname, userId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const listRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    const socket = io(API_URL, {
      transports: ["websocket"],
      // path: "/socket.io", // si tu as un path custom, décommente et adapte
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("joinRoom", { eventId, nickname, userId });
    });

    socket.on("joinedRoom", () => {});

    socket.on("newMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("error", (msg: string) => {
      console.warn("Socket error:", msg);
    });

    return () => {
      socket.disconnect();
    };
  }, [eventId, nickname, userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_URL}/chat/${eventId}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch chat messages", err);
      }
    };
    fetchMessages();
  }, [eventId]);

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  }, [messages.length]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socketRef.current?.emit("sendMessage", {
      eventId,
      content: input.trim(),
      nickname,
      userId,
    });
    setInput("");
  };

  if (!connected) {
    return (
      <View className="p-4 rounded-md border border-gray-200">
        <Text className="text-gray-500 text-sm">Connecting to chat...</Text>
      </View>
    );
  }

  return (
    <View className="border border-gray-200 rounded-xl p-3 h-80">
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m, i) => m.id ?? `${i}`}
        renderItem={({ item }) => (
          <View className="py-1">
            <Text className="text-sm">
              <Text className="font-semibold">
                {item.nickname || item.user?.name || "Anonymous"}:{" "}
              </Text>
              <Text>{item.content}</Text>
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 8 }}
      />

      <View className="flex-row items-center gap-2 mt-2">
        <TextInput
          className="flex-1 border border-gray-300 rounded-xl px-3 py-2"
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={!input.trim()}
          className={`px-4 py-2 rounded-xl ${input.trim() ? "bg-black" : "bg-gray-300"}`}
        >
          <Text className="text-white font-medium">Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
