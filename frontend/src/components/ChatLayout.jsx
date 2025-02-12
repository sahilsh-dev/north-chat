import { useState } from "react";
import { AppSidebar } from "@/components/chat-sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ChatContent from "./ChatContent";
import api from "@/api";
import { toast } from "sonner";

export default function ChatLayout() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState(null);

  const handleUserSelect = async (user) => {
    try {
      setSelectedUser(user);
      const res = await api.get(`/api/chat/${user.id}/`);
      setMessages(res.data.messages);
      console.log("Messages: ", res.data);
      setRoomId(res.data.room_id);
    } catch (error) {
      toast.error("Failed to load chat messages");
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar onUserSelect={handleUserSelect} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h2 className="text-md font-semibold">Chatting with Shazam</h2>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <ChatContent
            selectedUser={selectedUser}
            messages={messages}
            setMessages={setMessages}
            roomId={roomId}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
