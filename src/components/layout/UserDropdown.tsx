"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  LogOut,
  Settings,
  ShoppingBag,
  Heart,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export default function UserDropdown() {
  const { user, logout } = useAuthStore();
  const { profile, fetchProfile } = useUserStore();
  console.log(profile, "my profile");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user && !profile) {
      fetchProfile();
    }
  }, [user, profile, fetchProfile]);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          onMouseEnter={() => setIsOpen(true)}
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {profile?.name ? (
                getInitials(profile.name)
              ) : (
                <UserCircle className="h-5 w-5" />
              )}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 p-2"
        align="end"
        forceMount
        onMouseLeave={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <DropdownMenuLabel className="font-normal p-3">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {profile?.name ? (
                      getInitials(profile.name)
                    ) : (
                      <UserCircle className="h-6 w-6" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium leading-none">
                    {profile?.name || "Set your name"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-2" />
          <div className="space-y-1 px-1">
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/account" className="flex items-center py-2">
                <Settings className="mr-3 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="text-sm">Account Settings</span>
                  <span className="text-xs text-muted-foreground">
                    Manage your account preferences
                  </span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/orders" className="flex items-center py-2">
                <ShoppingBag className="mr-3 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="text-sm">Orders</span>
                  <span className="text-xs text-muted-foreground">
                    View your order history
                  </span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/wishlist" className="flex items-center py-2">
                <Heart className="mr-3 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="text-sm">Wishlist</span>
                  <span className="text-xs text-muted-foreground">
                    Your saved items
                  </span>
                </div>
              </Link>
            </DropdownMenuItem>
          </div>
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 cursor-pointer px-3 py-2"
            onClick={() => logout()}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
