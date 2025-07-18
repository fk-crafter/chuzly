"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "motion/react";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <main className="h-[100dvh] w-full bg-black text-white flex flex-col justify-between items-center px-6 py-10 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full flex justify-center"
      >
        <Image src="/logo.png" alt="Chuzly logo" width={60} height={60} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col items-center space-y-4"
      >
        <h1 className="text-3xl font-bold leading-snug">
          Plan with your <br />
          friends, fast.
        </h1>
        <p className="max-w-xs text-sm text-gray-400">
          Skip the chaos. One link, clear options, quick decisions.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col w-full max-w-sm gap-4"
      >
        <Button
          onClick={() => router.push("/crrreate-account")}
          className="w-full py-5 text-base rounded-full bg-white text-black hover:bg-gray-200"
        >
          Create an account
        </Button>
        <Button
          onClick={() => router.push("/lougiin")}
          className="w-full py-5 text-base rounded-full bg-[#111] text-white border border-[#333] hover:bg-[#1a1a1a] transition"
        >
          Log in
        </Button>
      </motion.div>
    </main>
  );
}
