"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import Link from "next/link";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  console.log(formData);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Image Section */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:block w-1/2 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/30 z-10" />
        <motion.img
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src="/images/fashion-hero.jpg"
          alt="Fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-white p-12">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-6xl font-bold mb-4"
          >
            Welcome to Relic.
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-2xl text-center max-w-md"
          >
            Discover the latest in fashion and style
          </motion.p>
        </div>
      </motion.div>

      {/* Right Side - Form Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4 lg:p-12"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-2xl"
        >
          <Card className="p-12 backdrop-blur-sm bg-white/90 dark:bg-neutral-900/90 shadow-2xl rounded-3xl border-0">
            <motion.div
              variants={itemVariants}
              className="space-y-3 text-center mb-10"
            >
              <h2 className="text-4xl font-bold tracking-tight">
                Create Account
              </h2>
              <p className="text-lg text-muted-foreground">
                Join our fashion community today
              </p>
            </motion.div>

            <form className="space-y-8">
              <motion.div variants={itemVariants}>
                <Label
                  htmlFor="name"
                  className="text-base font-medium mb-2 block"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter ur name"
                  required
                  value={formData.name}
                  onChange={handleOnChange}
                  className="mt-2 h-14 text-lg bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label
                  htmlFor="email"
                  className="text-base font-medium mb-2 block"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleOnChange}
                  className="mt-2 h-14 text-lg bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700"
                  placeholder="you@example.com"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label
                  htmlFor="password"
                  className="text-base font-medium mb-2 block"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleOnChange}
                  className="mt-2 h-14 text-lg bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700"
                  placeholder="••••••••"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4">
                <Button
                  className="w-full h-14 text-lg bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-all duration-300"
                  size="lg"
                >
                  Create Account
                </Button>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-center text-base text-muted-foreground pt-4"
              >
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-black dark:text-white underline underline-offset-4 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  Sign in
                </Link>
              </motion.p>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default RegisterPage;
