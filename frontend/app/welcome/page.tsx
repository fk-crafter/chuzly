"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "motion/react";
import { useEffect } from "react";

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.backgroundColor = "#000";
    document.body.style.backgroundColor = "#000";
    return () => {
      document.documentElement.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <main className="h-[100dvh] w-full bg-black text-white flex flex-col justify-between items-center px-6 py-10 text-center overflow-hidden overscroll-none">
      <Image
        src="/tst.png"
        alt="background glow"
        fill
        className="object-cover z-0 pointer-events-none select-none opacity-15"
        priority
      />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full flex justify-center"
      >
        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Chuzly logo"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
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
          onClick={() => router.push("/login")}
          className="w-full py-5 text-base rounded-full bg-white text-black hover:bg-gray-200"
        >
          Log in
        </Button>
        <Button
          onClick={() => router.push("/create-account")}
          className=" w-full py-5 text-base rounded-full bg-[#111] text-white border border-[#333] hover:bg-[#1a1a1a] transition"
        >
          Create an account
        </Button>
      </motion.div>
    </main>
  );
}
