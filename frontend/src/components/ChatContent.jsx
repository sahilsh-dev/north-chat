import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import { v4 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { ACCESS_TOKEN, WS_CHAT_PATH } from "@/constants";
import { cn } from "@/lib/utils";

export default function ChatContent({
	selectedUser,
	messages,
	setMessages,
	roomId,
}) {
	const [input, setInput] = useState("");
	const [isFriendTyping, setFriendTyping] = useState(false);
	const bottomRef = useRef(null);
	const typingTimerRef = useRef(null);
	const isTypingRef = useRef(false);
	const friendTypingTimeoutRef = useRef(null);

	// Chat WebSocket setup
	const ws_url = `${import.meta.env.VITE_API_URL}/${WS_CHAT_PATH}/${roomId}/`;
	const { sendJsonMessage, lastMessage } = useWebSocket(ws_url, {
		shouldReconnect: (e) => true,
		share: true,
		queryParams: { token: localStorage.getItem(ACCESS_TOKEN) },
	});

	// Handle new messages from WebSocket
	useEffect(() => {
		if (lastMessage && lastMessage.data) {
			const messageData = JSON.parse(lastMessage.data);
			console.log("Message Data", messageData);
			if (messageData.type === "chat") {
				setMessages((prev) => prev.concat(messageData.message));
			} else if (
				messageData.type === "typing" &&
				messageData.sender_id == selectedUser.id
			) {
				setFriendTyping(messageData.is_typing);
				clearTimeout(friendTypingTimeoutRef.current);
				friendTypingTimeoutRef.current = setTimeout(() => {
					setFriendTyping(false);
				}, 2000);
			}
		}
	}, [lastMessage, setMessages]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

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

	const handleMessageSend = () => {
		if (input.trim()) {
			const newMessage = {
				id: messages.length + 1,
				content: input.trim(),
				created_at: new Date().toISOString(),
			};
			console.log("Sending message:", newMessage);
			sendJsonMessage({ type: "chat", message: newMessage.content });
			setInput("");
		}
	};

	const sendTypingSignal = (isTyping) => {
		sendJsonMessage({
			type: "typing",
			is_typing: isTyping,
		});
		isTypingRef.current = isTyping;
	};

	const handleInputFocus = () => {
		sendTypingSignal(true);
		clearInterval(typingTimerRef.current);
		typingTimerRef.current = setInterval(() => {
			if (document.activeElement === document.getElementById("chat-input")) {
				sendTypingSignal(true);
			} else {
				handleInputBlur();
			}
		}, 2000);
	};

	const handleInputBlur = () => {
		clearInterval(typingTimerRef.current);
		if (isTypingRef.current === true) {
			sendTypingSignal(false);
		}
	};

	return (
		<div className="flex-1 flex flex-col">
			{/* Chat Header */}
			<div className="border-b p-4 flex items-center gap-3">
				<Avatar className="h-8 w-8">
					<AvatarImage src={selectedUser.icon} alt={selectedUser.name} />
					<AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
				</Avatar>
				<span className="font-medium">{selectedUser.name}</span>
				{isFriendTyping && (
					<span className="text-sm text-green-500">Typing...</span>
				)}
			</div>

			{/* Messages Area */}
			<ScrollArea className="p-4 h-[72vh]">
				{messages.map((message) => {
					const isSender = message.sender_id !== selectedUser.id;
					return (
						<div
							key={uuid()}
							className={cn(
								"mb-4 flex",
								isSender ? "justify-end" : "justify-start"
							)}
						>
							<div
								className={cn(
									"max-w-[70%] rounded-lg p-3 font-medium",
									isSender ? "bg-blue-500 text-white" : "bg-gray-500"
								)}
							>
								<p className="max-w-80 text-wrap break-words">
									{message.content}
								</p>
								<span
									className={cn(
										"text-xs opacity-70 block",
										isSender && "text-right"
									)}
								>
									{formatDate(message.created_at)}
								</span>
							</div>
						</div>
					);
				})}
				{/* Bottom marker div */}
				<div ref={bottomRef} />
				<ScrollBar />
			</ScrollArea>

			{/* Message Input */}
			<div className="border-t p-4">
				<div className="flex gap-2">
					<Input
						id="chat-input"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Type a message..."
						onKeyDown={(e) => e.key === "Enter" && handleMessageSend()}
						onFocus={handleInputFocus}
						onBlur={handleInputBlur}
						className="flex-1"
					/>
					<Button onClick={handleMessageSend}>
						<Send className="h-4 w-4" />
						<span className="sr-only">Send</span>
					</Button>
				</div>
			</div>
		</div>
	);
}
