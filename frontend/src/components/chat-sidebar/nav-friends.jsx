import { useState } from "react";
import { MoreHorizontal, Trash2, UserRoundPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import api from "@/api";
import { toast } from "sonner";

function AddFriendDialogButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddFriend = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/friends/accept/", {
        code: e.target.code.value,
      });
      if (res.ok) {
        toast.success("Friend added successfully");
      }
    } catch (error) {
      toast.error("Failed to add friend");
      console.error(error);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton className="text-sidebar-foreground/70">
          <UserRoundPlus className="text-sidebar-foreground/70" />
          <span>Add Friend</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a friend</DialogTitle>
          <DialogDescription>
            Enter the invite code of the friend you want to add. You can also
            generate your invite code from the profile button
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddFriend}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input id="code" placeholder="ABCDEF" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add friend</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function NavFriends({ friends, onUserSelect }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Friends</SidebarGroupLabel>
      <SidebarMenu>
        {friends.map((item) => (
          <SidebarMenuItem
            key={item.name}
            onClick={() => {
              onUserSelect(item);
            }}
          >
            <SidebarMenuButton asChild>
              <div>
                <item.icon />
                <span>{item.name}</span>
              </div>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Remove Friend</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <AddFriendDialogButton />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
