"use client";

import { useChat } from "ai/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import MessageList from "../messageList";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";

interface ChatComponent {
  chatId: number;
}

export default function ChatComponent({ chatId }: ChatComponent) {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { input, messages, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");

    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <div
      className="relative max-h-screen overflow-scroll bg-white p-4"
      id="message-container"
    >
      <header className="sticky top-0 inset-x-0 p-2 h-fit">
        <h3 className="text-xl text-slate-900 font-bold">Chat</h3>
      </header>

      <MessageList messages={messages} isLoading={isLoading} />

      <div className="flex">
        <form
          onSubmit={handleSubmit}
          className="flex sticky bottom-0 inset-x-0 px-2 py-4 w-full bg-white"
        >
          <Input
            className="w-full text-slate-900"
            placeholder="Ask any question..."
            value={input}
            onChange={handleInputChange}
          />

          <Button type="submit" className="bg-blue-600 ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
