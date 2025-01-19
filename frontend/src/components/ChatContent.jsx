import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export default function ChatContent({ selectedUser, messages, setMessages }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "You",
        content: input.trim(),
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      };
      setMessages([...messages, newMessage]);
      setInput("");
    }
  };

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
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.sender === "You" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 font-medium ${
                    message.sender === "You"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-500"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
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
