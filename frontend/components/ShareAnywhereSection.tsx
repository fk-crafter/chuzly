"use client";

import React, { useRef, forwardRef } from "react";
import { motion } from "motion/react";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { cn } from "@/lib/utils";
import Image from "next/image";

import {
  FaWhatsapp,
  FaFacebookMessenger,
  FaDiscord,
  FaInstagram,
  FaSnapchat,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const platforms = [
  { icon: <FaWhatsapp size={20} />, refName: "whatsapp" },
  { icon: <FaFacebookMessenger size={20} />, refName: "messenger" },
  { icon: <FaDiscord size={20} />, refName: "discord" },
  { icon: <FaInstagram size={20} />, refName: "instagram" },
  { icon: <FaXTwitter size={20} />, refName: "twitter" },
  { icon: <FaSnapchat size={20} />, refName: "snapchat" },
];

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export function ShareAnywhereSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  const refs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({
    whatsapp: useRef(null),
    messenger: useRef(null),
    discord: useRef(null),
    instagram: useRef(null),
    twitter: useRef(null),
    snapchat: useRef(null),
  });

  return (
    <section className="w-full bg-background py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.6 }}
        className="max-w-2xl mx-auto text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Share it where your friends already are
        </h2>
        <p className="text-muted-foreground text-lg">
          Send your event anywhere: WhatsApp, Messenger, Discord, and more.
        </p>
      </motion.div>

      <div
        className="relative flex h-[300px] w-full items-center justify-center overflow-hidden"
        ref={containerRef}
      >
        <div className="flex size-full max-h-[240px] max-w-md flex-col items-stretch justify-between gap-10">
          <div className="flex flex-row items-center justify-between">
            <Circle ref={refs.current.whatsapp}>{platforms[0].icon}</Circle>
            <Circle ref={refs.current.messenger}>{platforms[1].icon}</Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle ref={refs.current.discord}>{platforms[2].icon}</Circle>
            <div
              ref={centerRef}
              className="flex z-10 size-20 items-center justify-center rounded-full border-4 border-primary bg-white shadow-xl"
            >
              <Image src="/logo1.png" alt="App Logo" width={50} height={50} />
            </div>
            <Circle ref={refs.current.instagram}>{platforms[3].icon}</Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle ref={refs.current.twitter}>{platforms[4].icon}</Circle>
            <Circle ref={refs.current.snapchat}>{platforms[5].icon}</Circle>
          </div>
        </div>

        {Object.keys(refs.current).map((key) => (
          <AnimatedBeam
            key={key}
            containerRef={containerRef}
            fromRef={refs.current[key]}
            toRef={centerRef}
          />
        ))}
      </div>
    </section>
  );
}
