"use client";

import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useSparkles } from "@/components/SparklesText";
import { motion } from "motion/react";

export function WithCard() {
  const benefits = [
    "Create events with multiple options",
    "Share a link — no account needed",
    "Friends vote easily",
    "Track costs & responses",
    "Pick the best plan automatically",
  ];

  const sparkles = useSparkles({
    sparkleCount: 25,
    sparkleSize: 14,
    colors: { first: "#6366F1", second: "#A78BFA" },
  });

  return (
    <Card className="relative w-[90%] sm:w-[420px] rounded-2xl bg-background border border-border shadow-2xl px-8 py-6 overflow-hidden">
      <div className="absolute inset-0 z-10 pointer-events-none">
        {sparkles.map((s) => (
          <motion.span
            key={s.id}
            className="absolute"
            style={s.style}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: 1, rotate: [0, 90, 180] }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              delay: parseFloat(s.style.animationDelay as string),
            }}
          >
            <svg
              width={s.size}
              height={s.size}
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M120 80L100 0 80 80 0 100l80 20 20 80 20-80 80-20-80-20z"
                fill={s.color}
              />
            </svg>
          </motion.span>
        ))}
      </div>

      <div className="relative z-20 space-y-4">
        <p className="text-primary text-center font-semibold text-lg tracking-tight">
          With Chuzly
        </p>

        <ul className="space-y-3">
          {benefits.map((text, index) => (
            <li
              key={index}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <Check className="text-primary w-4 h-4" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
