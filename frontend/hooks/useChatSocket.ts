import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

type Message = {
  id: string;
  content: string;
  nickname: string;
  authorId?: string;
  createdAt: string;
  eventId: string;
};

type Props = {
  eventId: string;
  onNewMessage: (message: Message) => void;
};

export function useChatSocket({ eventId, onNewMessage }: Props) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.emit("joinRoom", { eventId });

    socket.on("newMessage", (message: Message) => {
      onNewMessage(message);
    });

    return () => {
      socket.disconnect();
    };
  }, [eventId, onNewMessage]);

  const sendMessage = (data: {
    content: string;
    nickname: string;
    authorId?: string;
  }) => {
    socketRef.current?.emit("sendMessage", {
      ...data,
      eventId,
    });
  };

  return { sendMessage };
}
