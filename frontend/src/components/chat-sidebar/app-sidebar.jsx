import { useEffect, useState } from "react";
import api from "@/api";
import { Link } from "react-router-dom";
import { House } from "lucide-react";
import { NavFriends } from "@/components/chat-sidebar/nav-friends";
import { NavUser } from "@/components/chat-sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Bot } from "lucide-react";
import { toast } from "sonner";

export function AppSidebar({ onUserSelect }) {
  const [sidebarData, setSidebarData] = useState({
    friends: [],
    user: { name: "Loading...", email: "" },
  });

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const userRes = await api.get("/api/users/");
        const friendsRes = await api.get("/api/friends/");

        const userData = userRes.data;
        const friendsData = friendsRes.data;

        const friends = friendsData.map((friend) => ({
          id: friend.id,
          name: friend.username,
          isOnline: friend.is_online,
          icon: Bot,
        }));

        const data = {
          friends: friends,
          user: {
            id: userData.id,
            name: userData.username,
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
          },
        };

        setSidebarData(data);
      } catch (error) {
        toast.error("Failed to load friends and user data");
        console.error(error);
      }
    };

    fetchSidebarData();
  }, []);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <House className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">North Chat</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavFriends friends={sidebarData.friends} onUserSelect={onUserSelect} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
