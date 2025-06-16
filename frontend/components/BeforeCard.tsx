"use client";

import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

export function BeforeCard() {
  const problems = [
    "No one agrees on what to do",
    "Too many options, no decision",
    "No idea who's coming",
    "Endless chat threads",
    "No clue about cost",
  ];

  return (
    <Card className="w-[420px] h-auto rounded-2xl bg-background border border-border shadow-2xl px-8 py-6 space-y-4">
      <p className="text-destructive text-center font-semibold text-lg tracking-tight">
        Before Chuzly
      </p>

      <ul className="space-y-3">
        {problems.map((problem, index) => (
          <li
            key={index}
            className="flex items-center gap-3 text-sm text-muted-foreground"
          >
            <X className="text-destructive w-4 h-4" />
            <span>{problem}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
