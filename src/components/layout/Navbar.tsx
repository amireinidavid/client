"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Search, Menu, X, User, Heart } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import UserDropdown from "./UserDropdown";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/useCartStore";

const categories = [
  {
    name: "Fashion",
    subcategories: [
      {
        title: "Women",
        items: ["Dresses", "Tops", "Pants", "Skirts", "Activewear"],
      },
      {
        title: "Men",
        items: ["Shirts", "Pants", "Suits", "T-Shirts", "Activewear"],
      },
      {
        title: "Accessories",
        items: ["Bags", "Jewelry", "Scarves", "Belts", "Sunglasses"],
      },
    ],
  },
  {
    name: "Accessories",
    subcategories: [
      {
        title: "Jewelry",
        items: ["Necklaces", "Rings", "Earrings", "Bracelets", "Watches"],
      },
      {
        title: "Bags",
        items: ["Handbags", "Backpacks", "Wallets", "Clutches", "Travel"],
      },
      {
        title: "Others",
        items: [
          "Hair Accessories",
          "Phone Cases",
          "Keychains",
          "Hats",
          "Gloves",
        ],
      },
    ],
  },
];

const navigationItems = [
  { name: "What's New", href: "/whats-new" },
  { name: "Shop", href: "/products" },
  { name: "Men", href: "/men" },
  { name: "Women", href: "/women" },
  { name: "Designers", href: "/designers" },
  { name: "Sneakers", href: "/sneakers" },
  { name: "Gifting", href: "/gifting" },
  { name: "Editorials", href: "/editorials" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuthStore();
  const [announcement, setAnnouncement] = useState(0);
  const { fetchCart, items } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  const announcements = [
    {
      text: "Introducing 234LABS. Discover the debut collection.",
      link: "Shop Now",
    },
    { text: "Free shipping on all orders over $200", link: "Learn More" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-shadow duration-300 ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      {/* Announcement Bar */}
      <div className="bg-black text-white text-xs py-2.5">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <button
            className="p-1 text-white/60 hover:text-white"
            onClick={() =>
              setAnnouncement(
                (prev) =>
                  (prev - 1 + announcements.length) % announcements.length
              )
            }
          >
            ←
          </button>
          <AnimatePresence mode="wait">
            <motion.div
              key={announcement}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center gap-2"
            >
              <span>{announcements[announcement].text}</span>
              <Link href="#" className="underline underline-offset-2">
                {announcements[announcement].link}
              </Link>
            </motion.div>
          </AnimatePresence>
          <button
            className="p-1 text-white/60 hover:text-white"
            onClick={() =>
              setAnnouncement((prev) => (prev + 1) % announcements.length)
            }
          >
            →
          </button>
        </div>
      </div>

      <div className="bg-white">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Left - Logo and Search */}
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Relic.</h1>
            <button className="p-2 hover:opacity-70 transition-opacity">
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
          </div>

          {/* Center - Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm hover:opacity-70 transition-opacity"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right - Account, Wishlist, Cart */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <UserDropdown />
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <User className="h-5 w-5" />
                <span className="hidden md:block">Sign in</span>
              </Link>
            )}
            <Link
              href="/wishlist"
              className="hover:opacity-70 transition-opacity"
            >
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <Link
              href="/cart"
              className="hover:opacity-70 transition-opacity relative"
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] rounded-full h-[18px] w-[18px] flex items-center justify-center">
                {items?.length}
              </span>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-4">
            <Link
              href="/cart"
              className="hover:opacity-70 transition-opacity relative"
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] rounded-full h-[18px] w-[18px] flex items-center justify-center">
                0
              </span>
            </Link>
            <Link href="/auth/login">
              <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-8">
                  {navigationItems.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        className="text-lg font-medium hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                      <Separator className="mt-4" />
                    </div>
                  ))}
                  <div className="pt-4">
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                      Wishlist
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
