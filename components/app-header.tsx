"use client";

import { signOut } from "next-auth/react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import type { Session } from "next-auth";

interface AppHeaderProps {
  session: Session | null;
}

export function AppHeader({ session }: AppHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <div className="flex flex-1" />
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-2 rounded-md p-1.5 hover:bg-accent"
          aria-label="User menu"
        >
          <Avatar className="size-8">
            <AvatarFallback>
              {session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? "?"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium max-md:sr-only">
            {session?.user?.name ?? session?.user?.email ?? "User"}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => signOut({ callbackUrl: "/" })}
              className="flex cursor-default items-center gap-2"
            >
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
