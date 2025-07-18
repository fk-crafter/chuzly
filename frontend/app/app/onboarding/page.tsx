"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

const COLORS = [
  "bg-muted",
  "bg-[var(--color-pastel-green)]",
  "bg-[var(--color-pastel-blue)]",
  "bg-[var(--color-pastel-yellow)]",
  "bg-[var(--color-pastel-pink)]",
  "bg-[var(--color-pastel-lavender)]",
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("newUserName") || "";
    }
    return "";
  });
  const [color, setColor] = useState(COLORS[0]);
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleNameSubmit = async () => {
    if (!token || !name.trim()) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/update-name`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: name.trim() }),
    });

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/avatar-color`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ color }),
    });

    localStorage.setItem("avatarColor", color);

    setStep(2);
  };

  const finishOnboarding = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/complete-onboarding`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    window.location.href = "/app/dashboard";
  };

  return (
    <main className="max-w-xl mx-auto py-20 px-4 text-center">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-4">Welcome to Chuzly 🎉</h1>
            <p className="mb-8 text-muted-foreground">
              Plan with your friends faster than ever. Let's get you started!
            </p>
            <Button onClick={() => setStep(1)}>Start setup</Button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold mb-4">
              Personalize your profile ✨
            </h1>
            <p className="mb-6 text-muted-foreground">
              Pick a display name and avatar color.
            </p>
            <div className="flex flex-col items-center space-y-4">
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="max-w-xs"
              />
              <div className="flex gap-2 flex-wrap justify-center">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    className={cn(
                      "w-8 h-8 rounded-full border-2",
                      color === c ? "border-black" : "border-transparent",
                      c
                    )}
                    onClick={() => setColor(c)}
                    type="button"
                  />
                ))}
              </div>
              <div
                className={cn(
                  "w-16 h-16 rounded-full border mt-4 shadow-lg",
                  color
                )}
              />
              <Button
                onClick={handleNameSubmit}
                disabled={!name.trim()}
                className="mt-4"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="first-event"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold mb-4">
              Create your first event? 🎈
            </h1>
            <p className="mb-8 text-muted-foreground">
              You can start planning right now or skip and do it later.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={() => router.push("/app/create-event")}>
                Yes, let's go!
              </Button>
              <Button variant="outline" onClick={() => setStep(3)}>
                Skip for now
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="finished"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold mb-4">You're all set! 🎉</h1>
            <p className="mb-8 text-muted-foreground">
              Enjoy creating and sharing your events!
            </p>
            <Button onClick={finishOnboarding}>Go to Dashboard</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
