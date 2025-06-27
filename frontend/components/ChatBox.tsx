"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: string;
  content: string;
  nickname?: string;
  user?: { name: string };
  createdAt: string;
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
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      console.log("EMITTING joinRoom", { eventId, nickname, userId });
      socket.emit("joinRoom", { eventId, nickname, userId });
    });

    socket.on("joinedRoom", () => {
      console.log("Joined chat room", eventId);
    });

    socket.on("newMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("error", (msg: string) => {
      console.error("Socket error:", msg);
    });

    return () => {
      socket.disconnect();
    };
  }, [eventId, nickname, userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/chat/${eventId}`
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch chat messages", err);
      }
    };

    fetchMessages();
  }, [eventId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      <div className="p-4 rounded border text-sm text-muted-foreground">
        Connecting to chat...
      </div>
    );
  }

  return (
    <div className="border rounded-md p-4 space-y-4 max-h-[400px] flex flex-col">
      <ScrollArea className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              <span className="font-semibold mr-1">
                {msg.nickname || msg.user?.name || "Anonymous"}:
              </span>
              <span>{msg.content}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex items-center gap-2"
      >
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" disabled={!input.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
