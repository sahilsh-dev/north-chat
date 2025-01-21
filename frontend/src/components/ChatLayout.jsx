import { useState } from "react";
import { AppSidebar } from "@/components/chat-sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ChatContent from "./ChatContent";

export default function ChatLayout() {
  // Sample messages for demo
  const mockMessages = {
    1: [
      {
        id: 1,
        sender: "Bob Johnson",
        content: "How are you?",
        timestamp: "9:30 AM",
      },
      {
        id: 2,
        sender: "You",
        content: "Doing great, thanks!",
        timestamp: "9:31 AM",
      },
    ],
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setMessages(mockMessages[user.id]);
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
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
