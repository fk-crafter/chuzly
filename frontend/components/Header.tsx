"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full flex items-center justify-between px-6 py-4 border-b backdrop-blur-sm bg-white top-0 z-50"
    >
      <Link href="/" className="flex items-center">
        <Image
          src="/logo3.png"
          alt="Chuzly Logo"
          width={50}
          height={50}
          priority
        />
      </Link>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
        className="flex items-center gap-3"
      >
        <Link href="/login" className="text-sm hover:underline">
          Login
        </Link>
        <Link href="/create-account">
          <Button size="sm" className="cursor-pointer">
            Sign up
          </Button>
        </Link>
      </motion.div>
    </motion.header>
  );
}
