"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "motion/react";
import Head from "next/head";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta name="theme-color" content="#000000" />
      </Head>

      <div className="fixed top-0 left-0 w-full h-full bg-black z-50">
        <main className="w-full h-full flex flex-col justify-between items-center px-6 py-10 text-white text-center overflow-hidden">
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
            className="flex flex-col items-center space-y-4 mt-20"
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
            className="flex flex-col w-full max-w-sm gap-4 mt-16"
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

          <div className="h-6" />
        </main>
      </div>
    </>
  );
}
