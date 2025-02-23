import { useEffect } from "react";
import ChatLayout from "@/components/ChatLayout";
import useWebSocket from "react-use-websocket";
import { ACCESS_TOKEN, WS_ONLINE_PATH } from "@/constants";

export default function Chat() {
  const ws_url = `${import.meta.env.VITE_API_URL}/${WS_ONLINE_PATH}`;
  const { sendJsonMessage, lastMessage } = useWebSocket(ws_url, {
    onMessage: () => {
      "Sending Online Status";
    },
    shouldReconnect: (e) => true,
    share: true,
    queryParams: { token: localStorage.getItem(ACCESS_TOKEN) },
  });

  useEffect(() => {
    const sendOnlineStatus = () => {
      sendJsonMessage({ status: "online" });
    };
    const intervalId = setInterval(sendOnlineStatus, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <ChatLayout />
    </div>
  );
}
