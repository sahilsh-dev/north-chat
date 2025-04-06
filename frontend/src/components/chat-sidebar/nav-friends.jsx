import { useState, useEffect } from "react";
import { MoreHorizontal, Trash2, UserRoundPlus, Bot } from "lucide-react";
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

function AddFriendDialogButton({ updateFriendsData }) {
	const [isOpen, setIsOpen] = useState(false);

	const handleAddFriend = async (e) => {
		e.preventDefault();
		try {
			const res = await api.post("/api/friends/accept/", {
				code: e.target.code.value,
			});
			if (res.data.success) {
				updateFriendsData();
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

export function NavFriends({ onUserSelect, setSelectedUser }) {
	const { isMobile } = useSidebar();
	const [friends, setFriends] = useState([]);

	const updateFriendsData = async () => {
		try {
			const friendsRes = await api.get("/api/friends/");
			const friendsData = friendsRes.data;
			const friends = friendsData.map((friend) => ({
				id: friend.id,
				name: friend.username,
				isOnline: friend.is_online,
				icon: Bot,
			}));
			setFriends(friends);
		} catch (error) {
			toast.error("Failed to load friends data");
			console.error(error);
		}
	};

	const handleDeleteFriend = async (friendId) => {
		try {
			const res = await api.delete(`/api/friends/${friendId}/`);
			if (res.data.success) {
				toast.success("Friend removed successfully");
				updateFriendsData();
				setSelectedUser(null);
			} else {
				toast.error("Failed to remove friend");
			}
		} catch (error) {
			toast.error("Failed to remove friend");
			console.error("Error removing friend:", error);
		}
	};

	useEffect(() => {
		updateFriendsData();
		const intervalId = setInterval(updateFriendsData, 30000);
		return () => clearInterval(intervalId);
	}, []);

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
						<SidebarMenuButton asChild className="cursor-pointer">
							<div>
								<div className="relative">
									<item.icon />
									{item.isOnline ? (
										<div className="w-2 h-2 bg-green-500 rounded-full absolute top-0 right-0" />
									) : null}
								</div>
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
								<DropdownMenuItem onClick={() => handleDeleteFriend(item.id)}>
									<Trash2 className="text-muted-foreground mr-2 h-4 w-4" />
									<span>Remove Friend</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				))}
				<SidebarMenuItem>
					<AddFriendDialogButton updateFriendsData={updateFriendsData} />
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}
