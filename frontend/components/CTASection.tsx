"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";

export function CTASection() {
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
    <section
      id="waitlist"
      className="relative w-full py-32 px-4 flex items-center justify-center bg-background overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-30 blur-xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-xl w-full bg-background/70 backdrop-blur-md border border-border rounded-2xl p-10 text-center shadow-xl"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Stay in the loop
        </h2>
        <p className="text-muted-foreground mb-6">
          Be the first to know when we launch. Drop your email and we’ll keep
          you updated.
        </p>

        {joined ? (
          <p className="text-green-600 font-medium">
            Thank you for signing up! We'll keep you posted.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full sm:w-auto"
            />
            <Button
              type="submit"
              disabled={loading || !isValidEmail}
              className="w-full sm:w-auto"
            >
              {loading ? "Submitting..." : "Join us"}
            </Button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
