"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import Link from "next/link";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { TestimonialSection } from "./TestimonialSection";

export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center px-4 text-center pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 mb-4"
      >
        <div
          className={cn(
            "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          )}
        >
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>✨ Join the future of event planning</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold tracking-tight mb-6 z-10 selection:bg-black selection:text-white"
      >
        Plan events without <br />
        <span className="inline-block mt-2 px-2 py-1 rounded bg-primary text-white">
          group chaos
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-muted-foreground max-w-xl mb-6 z-10 text-sm md:text-base"
      >
        Share a link, collect votes on dates, times or ideas, and make group
        decisions instantly. No logins. No endless chats.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 z-10 mb-6"
      >
        <Link href="/create-account">
          <Button className="w-full sm:w-auto">Get started</Button>
        </Link>
        <Link href="#features">
          <Button variant="outline" className="w-full sm:w-auto">
            Learn more
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="z-10 mt-2 flex flex-col items-center"
      >
        <p className="text-muted-foreground text-sm mb-2">
          Loved by early users
        </p>
        <TestimonialSection />
      </motion.div>

      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        )}
      />
    </section>
  );
}
