import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import useWebSocket from "react-use-websocket";
import { WS_PATH } from "@/constants";
import { ACCESS_TOKEN } from "@/constants";

export default function ChatContent({
  selectedUser,
  messages,
  setMessages,
  roomId,
}) {
  const [input, setInput] = useState("");
  const ws_url = `${import.meta.env.VITE_API_URL}/${WS_PATH}/${roomId}/`;
  const { sendJsonMessage, lastMessage } = useWebSocket(ws_url, {
    onMessage: () => {
      "Connected to Chat";
    },
    shouldReconnect: (e) => true,
    share: true,
    queryParams: { token: localStorage.getItem(ACCESS_TOKEN) },
  });

  const formatDate = (date) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      day: "numeric",
    };
    const formattedDate = new Date(date).toLocaleString("en-US", options);
    const [datePart, time] = formattedDate.split(", ");
    return `${time}, ${datePart}`;
  };

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = {
        id: messages.length + 1,
        content: input.trim(),
        created_at: new Date().toISOString(),
      };
      sendJsonMessage({ message: newMessage.content });
      setInput("");
    }
  };

  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      const messageData = JSON.parse(lastMessage.data);
      setMessages((prev) => prev.concat(messageData.message));
    }
  }, [lastMessage]);

  return (
    <div className="flex-1 flex flex-col h-full">
      {selectedUser ? (
        <>
          {/* Chat Header */}
          <div className="border-b p-4 flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={selectedUser.icon} alt={selectedUser.name} />
              <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{selectedUser.name}</span>
          </div>
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            {messages.map((message) => {
              return (
                <div
                  key={uuid()}
                  className={`mb-4 flex ${
                    message.sender_id === selectedUser.id
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 font-medium ${
                      message.sender_id === selectedUser.id
                        ? "bg-gray-500"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70">
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </ScrollArea>
          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
}
