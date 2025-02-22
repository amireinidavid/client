"use client";

import { motion } from "framer-motion";
import { Truck, Shield, RefreshCw, Clock } from "lucide-react";

const trustSignals = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $200",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure checkout",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Always here to help",
  },
];

export default function TrustSignals() {
  return (
    <section className="py-16 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustSignals.map((signal, index) => (
            <motion.div
              key={signal.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <signal.icon
                className="w-12 h-12 mb-4 text-neutral-800"
                strokeWidth={1.5}
              />
              <h3 className="text-lg font-medium mb-2">{signal.title}</h3>
              <p className="text-neutral-600">{signal.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
