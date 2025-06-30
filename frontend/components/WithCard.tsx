"use client";

import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export function WithCard() {
  const benefits = [
    "Create events with multiple options",
    "Share a link — no account needed",
    "Friends vote easily",
    "Track costs & responses",
    "Pick the best plan automatically",
  ];

  return (
    <Card className="w-[90%] sm:w-[420px] rounded-2xl bg-background border border-border shadow-2xl px-8 py-6 space-y-4">
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
    </Card>
  );
}
