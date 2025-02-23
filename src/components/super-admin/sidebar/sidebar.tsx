"use client";

import { cn } from "@/lib/utils";
import {
  FiChevronLeft,
  FiChevronRight,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import {
  MdHome,
  MdLocalOffer,
  MdShoppingCart,
  MdCardGiftcard,
  MdPeople,
  MdNewspaper,
  MdNotifications,
  MdStar,
  MdShoppingBag,
  MdPrint,
  MdCategory,
} from "react-icons/md";
import { BsBox, BsLightning, BsTagsFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const menuItems = [
  {
    name: "Products",
    icon: MdHome,
    href: "/super-admin/products/list",
  },
  {
    name: "Add New Product",
    icon: MdPrint,
    href: "/super-admin/products/add",
  },
  {
    name: "Orders",
    icon: MdShoppingCart,
    href: "/super-admin/order/list",
  },
  {
    name: "Coupons",
    icon: MdCardGiftcard,
    href: "/super-admin/coupons/list",
  },
  {
    name: "Hero Section",
    icon: MdStar,
    href: "/super-admin/hero/list",
  },
  {
    name: "Featured Categories",
    icon: MdCategory,
    href: "/super-admin/featuredCategories/list",
  },
  {
    name: "Trending Products",
    icon: BsBox,
    href: "/super-admin/trending-products/list",
  },
  {
    name: "Promotional Banners",
    icon: BsTagsFill,
    href: "/super-admin/promotional-banner/list",
  },
  {
    name: "Recommendations",
    icon: MdPeople,
    href: "/super-admin/recommendations/list",
  },
  {
    name: "Flash Sales",
    icon: BsLightning,
    href: "/super-admin/flashsale/list",
  },
  {
    name: "Blog Posts",
    icon: MdNewspaper,
    href: "/super-admin/blog/list",
  },
  {
    name: "Trust Signals",
    icon: MdNotifications,
    href: "/super-admin/trust-signals/list",
  },
  {
    name: "Settings",
    icon: FiSettings,
    href: "/super-admin/settings/list",
  },
];

function SuperAdminSidebar({ isOpen, toggle }: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuthStore();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isMobile && isOpen) {
      toggle();
    }
  }, [isMobile]);

  const sidebarVariants = {
    open: { width: "280px" },
    closed: { width: "72px" },
  };

  const menuItemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -10 },
  };

  async function handleLogout() {
    await logout();
    router.push("/auth/login");
  }

  return (
    <motion.div
      initial={isOpen ? "open" : "closed"}
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-background/95 backdrop-blur-sm",
        "border-r shadow-lg",
        "flex flex-col"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <motion.h1
          variants={menuItemVariants}
          className={cn(
            "font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent",
            !isOpen && "hidden"
          )}
        >
          Admin Panel
        </motion.h1>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hover:bg-primary/10 transition-colors"
          onClick={toggle}
        >
          {isOpen ? (
            <FiChevronLeft className="h-4 w-4" />
          ) : (
            <FiChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 space-y-2 py-4 overflow-y-auto scrollbar-hide">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={false}
            animate={{ x: 0 }}
            transition={{ delay: 0.1 * index }}
            onClick={() => router.push(item.href)}
            className={cn(
              "flex items-center mx-2 px-3 py-2.5 rounded-lg cursor-pointer",
              "hover:bg-primary/10 active:bg-primary/20 transition-all duration-200",
              "group"
            )}
          >
            <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            {isOpen && (
              <motion.span
                variants={menuItemVariants}
                className="ml-3 font-medium text-sm"
              >
                {item.name}
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="border-t p-4">
        <motion.div
          onClick={handleLogout}
          className={cn(
            "flex items-center px-3 py-2.5 rounded-lg cursor-pointer",
            "hover:bg-destructive/10 active:bg-destructive/20 transition-all duration-200",
            "group"
          )}
        >
          <FiLogOut className="h-5 w-5 text-destructive group-hover:text-destructive/80 transition-colors" />
          {isOpen && (
            <motion.span
              variants={menuItemVariants}
              className="ml-3 font-medium text-sm text-destructive"
            >
              Logout
            </motion.span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SuperAdminSidebar;
