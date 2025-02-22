"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import fashionHero2 from "../../../../public/images/fashion-hero-2.jpg";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { protectLoginAction, protectSignInAction } from "@/actions/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const checkFirstLevelOfValidation = await protectLoginAction(
      formData.email
    );

    if (!checkFirstLevelOfValidation.success) {
      toast({
        title: checkFirstLevelOfValidation.error,
        variant: "destructive",
      });
      return;
    }

    const success = await login(formData.email, formData.password);
    if (success) {
      toast({
        title: "Login Successfull!",
      });
      const user = useAuthStore.getState().user;
      if (user?.role === "SUPER_ADMIN") router.push("/super-admin");
      else router.push("/");
    }
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
        <Image
          alt="Login"
          fill
          priority
          src={fashionHero2} // Different image for login
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-white p-12">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-7xl font-bold mb-4 tracking-tight"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-2xl text-center max-w-md font-light"
          >
            Continue your fashion journey with Relic.
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
              className="space-y-3 text-center mb-12"
            >
              <h2 className="text-5xl font-bold tracking-tight">Sign In</h2>
              <p className="text-xl text-muted-foreground font-light">
                Welcome back to your fashion destination
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-8">
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
                  className="mt-2 h-16 text-lg bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700"
                  placeholder="you@example.com"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="password" className="text-base font-medium">
                    Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-muted-foreground hover:text-black dark:hover:text-white transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="mt-2 h-16 text-lg bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700"
                  placeholder="••••••••"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="pt-6">
                <Button
                  className="w-full h-16 text-xl bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-all duration-300"
                  size="lg"
                >
                  Sign In
                </Button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="relative my-8 text-center"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300 dark:border-neutral-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-neutral-900 px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 gap-4"
              >
                <Button
                  variant="outline"
                  className="h-14 text-base hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="h-14 text-base hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Apple
                </Button>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-center text-base text-muted-foreground pt-6"
              >
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-black dark:text-white underline underline-offset-4 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  Sign up
                </Link>
              </motion.p>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
