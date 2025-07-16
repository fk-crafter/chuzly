"use client";

import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center px-4 text-center pb-30">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="absolute top-4 right-4 z-20"
      >
        <Link
          href="https://www.producthunt.com/products/chuzly?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-chuzly"
          target="_blank"
        >
          <Image
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=991501&theme=dark&t=1752612095391"
            alt="Chuzly on Product Hunt"
            width={130}
            height={30}
            priority
          />
        </Link>
      </motion.div>

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
        className="text-4xl md:text-5xl font-bold tracking-tight mb-4 z-10"
      >
        Turn group chats into <br className="hidden md:block" />
        <span className="px-2 py-1 rounded bg-primary text-white mb-1 inline-block">
          quick decisions
        </span>{" "}
        in seconds.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-muted-foreground max-w-md mb-6 z-10"
      >
        Create one link, let everyone vote, and decide instantly.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 z-10"
      >
        <Link href="/create-account" passHref>
          <Button className="w-full sm:w-auto">Get started</Button>
        </Link>
        <Link href="#features">
          <Button variant="outline" className="w-full sm:w-auto">
            Learn more
          </Button>
        </Link>
      </motion.div>

      <BackgroundBeams className="hidden md:block" />
    </section>
  );
}
