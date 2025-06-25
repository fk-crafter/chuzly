"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

let socket: ReturnType<typeof io> | null = null;

type Message = {
  id: string;
  nickname: string;
  content: string;
  createdAt: string;
};

export default function Chat({
  eventId,
  nickname,
}: {
  eventId: string;
  nickname: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"],
    });

    socket.emit("joinRoom", { eventId });

    socket.on("newMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket?.disconnect();
    };
  }, [eventId]);

  const sendMessage = () => {
    if (!input.trim()) return;

    socket?.emit("sendMessage", {
      eventId,
      content: input,
      nickname,
    });

    setInput("");
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-muted/50">
      <div className="max-h-64 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="text-sm">
            <span className="font-semibold">{msg.nickname}: </span>
            <span>{msg.content}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
