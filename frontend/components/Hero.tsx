"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { motion } from "motion/react";

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
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold tracking-tight mb-4 z-10 -mt-20 md:-mt-30"
      >
        Tired of messy group chats <br className="hidden md:block" /> when
        planning?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-muted-foreground max-w-md mb-6 z-10"
      >
        Create one link, let everyone vote, and decide instantly.
      </motion.p>

      {joined ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-green-600 font-medium z-10"
        >
          Thank you for joining! You’re on the list. We’ll let you know very
          soon.
        </motion.p>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-row gap-3 w-full max-w-md z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Input
            type="email"
            placeholder="Your best email"
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
            {loading ? "Joining..." : "Get early access"}
          </Button>
        </motion.form>
      )}

      <BackgroundBeams className="hidden md:block" />
    </section>
  );
}
