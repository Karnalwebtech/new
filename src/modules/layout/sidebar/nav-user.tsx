"use client";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  Loader2,
  LogOut,
  Sparkles,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import UserAvatar from "@/components/UserAvatar";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { logout as stateLogOut } from "@/reducers/auth-slice";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/state/auth-api";
import { useHandleNotifications } from "@/hooks/use-notification-handler";

export function NavUser() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const [logout, { error, isLoading, isSuccess }] = useLogoutMutation();
  
  useHandleNotifications({
    error: error,
    isSuccess,
    successMessage: "Logged out successfully",
    redirectPath: "/auth/sign-in",
  });
  const { isMobile } = useSidebar();

  if (!user) {
    return null;
  }
  const logOutHandler = async () => {
  
      await fetch("/api/cookie", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    await logout().unwrap();
    dispatch(stateLogOut());
    router.push("/auth/sign-in");
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar
                fullname={user.name || ""}
                imageUrl={user.image || ""}
                alt={user.name}
                size={"w-8 h-8"}
                gender={user.gender}
              />

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar
                  fullname={user.name || ""}
                  imageUrl={user.image || ""}
                  alt={user.name}
                  size={"w-10 h-10"}
                  gender={user.gender}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup >
              <DropdownMenuItem onClick={() => router.push("/dashboard/account")} className="cursor-pointer">
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logOutHandler} className="cursor-pointer">
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
              ) : (
                <LogOut />
              )}
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
