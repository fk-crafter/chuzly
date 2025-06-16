"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CTASection() {
  return (
    <section
      id="beta"
      className="relative w-full py-32 px-4 flex items-center justify-center bg-background overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-30 blur-xl pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full bg-background/70 backdrop-blur-md border border-border rounded-2xl p-10 text-center shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Join the Chuzly beta
        </h2>
        <p className="text-muted-foreground mb-6">
          Get early access when we launch. Drop your email — we’ll reach out.
        </p>

        <form className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:w-auto"
            required
          />
          <Button type="submit" className="w-full sm:w-auto">
            Request Access
          </Button>
        </form>
      </div>
    </section>
  );
}
