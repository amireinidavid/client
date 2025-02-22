"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Twitter, Youtube, Mail } from "lucide-react";

const footerLinks = {
  shop: [
    { name: "Women", href: "/women" },
    { name: "Men", href: "/men" },
    { name: "Accessories", href: "/accessories" },
    { name: "Shoes", href: "/shoes" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Sale", href: "/sale" },
  ],
  help: [
    { name: "Customer Service", href: "/customer-service" },
    { name: "Track Order", href: "/track-order" },
    { name: "Returns & Exchanges", href: "/returns" },
    { name: "Shipping", href: "/shipping" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
  ],
  about: [
    { name: "Our Story", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Corporate Responsibility", href: "/responsibility" },
    { name: "Investors Relations", href: "/investors" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com" },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-100 dark:bg-neutral-900 border-t">
      {/* Newsletter Section */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-medium mb-3">Stay in the Know</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Subscribe to our newsletter to receive updates, access to
              exclusive deals, and more.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-black dark:bg-neutral-800 dark:border-neutral-700"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-full hover:bg-neutral-800 transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Social Links */}
          <div className="space-y-6">
            <Link href="/" className="block">
              <Image
                src="/images/relic-logo.svg"
                alt="Fashion Store"
                width={120}
                height={30}
                className="dark:invert"
              />
            </Link>
            <h1 className="text-neutral-600 text-2xl">Relic.</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Curating the future of fashion and lifestyle.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:text-neutral-600 transition-colors duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-medium text-lg mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-medium text-lg mb-4">Help</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="font-medium text-lg mb-4">About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="/images/payment/visa.svg"
                alt="Visa"
                width={40}
                height={25}
                className="dark:invert"
              />
              <Image
                src="/images/payment/mastercard.svg"
                alt="Mastercard"
                width={40}
                height={25}
                className="dark:invert"
              />
              <Image
                src="/images/payment/amex.svg"
                alt="American Express"
                width={40}
                height={25}
                className="dark:invert"
              />
              <Image
                src="/images/payment/paypal.svg"
                alt="PayPal"
                width={40}
                height={25}
                className="dark:invert"
              />
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              © {new Date().getFullYear()} Relic. Fashion Store. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
