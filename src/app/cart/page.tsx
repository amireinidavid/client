"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const {
    items,
    isLoading,
    fetchCart,
    updateCartItemQuantity,
    removeFromCart,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;
  const router = useRouter();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link href="/products">
            <Button className="bg-black hover:bg-gray-800">
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-12"
      >
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <span className="text-gray-600">{items.length} items</span>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-6 p-4 bg-white rounded-xl border hover:border-black transition-colors"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square w-24 rounded-lg overflow-hidden bg-gray-50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="mt-1 space-y-1">
                          <p className="text-sm text-gray-500">
                            Size: {item.size}
                          </p>
                          <p className="text-sm text-gray-500">
                            Color: {item.color}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </motion.button>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            updateCartItemQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1 rounded-md hover:bg-gray-100"
                        >
                          <FiMinus size={16} />
                        </motion.button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            updateCartItemQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1 rounded-md hover:bg-gray-100"
                        >
                          <FiPlus size={16} />
                        </motion.button>
                      </div>
                      <span className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 mt-8 text-gray-600 hover:text-black"
          >
            <FiArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <p className="text-sm text-gray-500">
                {shipping > 0 && "* Free shipping on orders over $100"}
              </p>
            </div>

            <Button
              onClick={() => router.push("/checkout")}
              className="w-full mt-6 bg-black hover:bg-gray-800"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
