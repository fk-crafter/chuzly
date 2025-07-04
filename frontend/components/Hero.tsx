"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";

export function Hero() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (joined || !isValidEmail) return;
    setLoading(true);
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setJoined(true);
      setEmail("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 z-10 -mt-20 md:-mt-30">
        Plan events with friends, effortlessly
      </h1>
      <p className="text-muted-foreground max-w-md mb-6 z-10">
        Create a poll, share one link, and let your friends pick the best option
        — no signup needed. Fast, fun, and stress-free.
      </p>

      {joined ? (
        <p className="text-green-600 font-medium z-10">
          Thank you for joining the waitlist! We’ll keep you updated very soon.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-row gap-3 w-full max-w-md z-10"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-white"
          />
          <Button
            type="submit"
            disabled={loading || !isValidEmail}
            className="w-auto flex-shrink-0"
          >
            {loading ? "Joining..." : "Join waitlist"}
          </Button>
        </form>
      )}

      {/* 
      <div className="flex flex-col sm:flex-row gap-3 z-10 mt-4">
        <Link href="#beta">
          <Button size="lg" className="cursor-pointer">
            Create an event
          </Button>
        </Link>
        <Link href="#how-it-works">
          <Button variant="outline" size="lg" className="cursor-pointer">
            How it works
          </Button>
        </Link>
      </div>
      */}

      <BackgroundBeams className="hidden md:block" />
    </section>
  );
}
