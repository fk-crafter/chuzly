"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Info,
  User,
  Palette,
  BadgeCheck,
  PartyPopper,
} from "lucide-react";
import { useRef } from "react";

const COLORS = [
  "bg-muted",
  "bg-[var(--color-pastel-green)]",
  "bg-[var(--color-pastel-blue)]",
  "bg-[var(--color-pastel-yellow)]",
  "bg-[var(--color-pastel-pink)]",
  "bg-[var(--color-pastel-lavender)]",
];

const motionProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4 },
};

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
  const [videoIndex, setVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videoSteps = [
    {
      title: "Fill in the Event Details",
      description:
        "Add everything you need: name, guests, price, location, and date options.",
    },
    {
      title: "Share Your Event",
      description:
        "Copy the invite link and send it to your friends. They’ll see the full event overview.",
    },
    {
      title: "Friends Vote",
      description:
        "Each guest picks their favorite option. Simple and fast voting experience.",
    },
  ];

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

    setStep(5);
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
      <div className="hidden md:block max-w-3xl mx-auto px-6 py-16 text-center">
        {/* Stepper line (optional) */}
        <div className="flex justify-center gap-2 mb-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 w-8 rounded-full transition-all duration-300",
                step === i ? "bg-black" : "bg-muted"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="desktop-0" {...motionProps}>
              <Sparkles className="mx-auto mb-4 h-8 w-8" />
              <h1 className="text-3xl font-bold mb-4">Welcome to Chuzly</h1>
              <p className="mb-6 text-muted-foreground text-lg">
                Plan events faster. Suggest options, vote, and share with
                friends.
              </p>
              <Button onClick={() => setStep(1)}>Get Started</Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="desktop-1" {...motionProps}>
              <Info className="mx-auto mb-4 h-8 w-8" />
              <h1 className="text-2xl font-bold mb-3">How it works</h1>
              <p className="mb-6 text-muted-foreground text-base">
                Watch how to use Chuzly in 3 steps.
              </p>

              {/* Video carousel */}
              <div className="flex flex-col items-center gap-4">
                <video
                  key={videoIndex}
                  ref={videoRef}
                  src={`/step${videoIndex + 1}.mp4`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full max-w-2xl aspect-video rounded-xl border border-border object-cover cursor-pointer"
                  onClick={() => {
                    const video = videoRef.current;
                    if (video) {
                      if (video.requestFullscreen) video.requestFullscreen();
                      else if ((video as any).webkitEnterFullscreen)
                        (video as any).webkitEnterFullscreen();
                    }
                  }}
                />
                <h3 className="text-lg font-semibold">
                  {videoSteps[videoIndex].title}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {videoSteps[videoIndex].description}
                </p>

                <div className="w-full h-2 bg-border rounded-full overflow-hidden max-w-lg">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{
                      width: `${((videoIndex + 1) / videoSteps.length) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex gap-4 mt-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setVideoIndex((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={videoIndex === 0}
                  >
                    ← Back
                  </Button>
                  {videoIndex < videoSteps.length - 1 ? (
                    <Button onClick={() => setVideoIndex((prev) => prev + 1)}>
                      Next →
                    </Button>
                  ) : (
                    <Button onClick={() => setStep(2)}>Continue</Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="desktop-2" {...motionProps}>
              <User className="mx-auto mb-4 h-8 w-8" />
              <h1 className="text-2xl font-bold mb-3">Your name</h1>
              <p className="mb-6 text-muted-foreground">
                How you’ll appear to others in events.
              </p>
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="max-w-sm mx-auto"
              />
              <Button
                className="mt-5"
                onClick={() => setStep(3)}
                disabled={!name.trim()}
              >
                Continue
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="desktop-3" {...motionProps}>
              <Palette className="mx-auto mb-4 h-8 w-8" />
              <h1 className="text-2xl font-bold mb-3">Pick a color</h1>
              <p className="mb-5 text-muted-foreground">
                Choose your avatar color for voting and messages.
              </p>
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
              <Button className="mt-5" onClick={() => setStep(4)}>
                Preview
              </Button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="desktop-4" {...motionProps}>
              <BadgeCheck className="mx-auto mb-4 h-8 w-8" />
              <h1 className="text-2xl font-bold mb-3">Here’s your profile</h1>
              <p className="mb-5 text-muted-foreground">
                You can change this later from settings.
              </p>
              <div className="flex flex-col items-center space-y-3">
                <div
                  className={cn("w-16 h-16 rounded-full shadow border", color)}
                />
                <span className="text-lg font-medium">{name}</span>
              </div>
              <Button className="mt-6" onClick={handleNameSubmit}>
                Confirm
              </Button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="desktop-5" {...motionProps}>
              <PartyPopper className="mx-auto mb-4 h-8 w-8" />
              <h1 className="text-2xl font-bold mb-3">You’re ready!</h1>
              <p className="mb-6 text-muted-foreground">
                Time to create your first event or explore the dashboard.
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => router.push("/app/create-event")}>
                  Create Event
                </Button>
                <Button variant="outline" onClick={finishOnboarding}>
                  Go to Dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 📱 Mobile */}
      <div className="block md:hidden">
        {/* Stepper */}
        <div className="flex justify-center mb-6 gap-1">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 w-6 rounded-full transition-all duration-300",
                step === i ? "bg-black" : "bg-muted"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step-0" {...motionProps}>
              <Sparkles className="mx-auto mb-3 h-6 w-6" />
              <h1 className="text-xl font-bold mb-3">Welcome to Chuzly</h1>
              <p className="mb-6 text-sm text-muted-foreground">
                Plan events faster. Suggest times, vote, and share with guests.
              </p>
              <div className="flex justify-end">
                <Button onClick={() => setStep(1)}>Next</Button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step-1" {...motionProps}>
              <Info className="mx-auto mb-3 h-6 w-6" />
              <h1 className="text-xl font-bold mb-3">How it works</h1>
              <p className="mb-4 text-sm text-muted-foreground">
                See how to use Chuzly step-by-step.
              </p>

              <div className="flex flex-col items-center px-4 py-6 gap-4">
                <video
                  key={videoIndex}
                  ref={videoRef}
                  src={`/step${videoIndex + 1}.mp4`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full aspect-video rounded-xl border border-border object-cover cursor-pointer"
                  onClick={() => {
                    const video = videoRef.current;
                    if (video) {
                      if (video.requestFullscreen) {
                        video.requestFullscreen();
                      } else if ((video as any).webkitEnterFullscreen) {
                        (video as any).webkitEnterFullscreen();
                      } else if ((video as any).mozRequestFullScreen) {
                        (video as any).mozRequestFullScreen();
                      } else if ((video as any).msRequestFullscreen) {
                        (video as any).msRequestFullscreen();
                      }
                    }
                  }}
                />

                <h3 className="text-lg font-semibold text-center">
                  {videoSteps[videoIndex].title}
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  {videoSteps[videoIndex].description}
                </p>

                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{
                      width: `${((videoIndex + 1) / videoSteps.length) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex gap-4 mt-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setVideoIndex((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={videoIndex === 0}
                  >
                    ← Back
                  </Button>
                  {videoIndex < videoSteps.length - 1 ? (
                    <Button onClick={() => setVideoIndex((prev) => prev + 1)}>
                      Next →
                    </Button>
                  ) : (
                    <Button onClick={() => setStep(2)}>Continue</Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step-2" {...motionProps}>
              <User className="mx-auto mb-3 h-6 w-6" />
              <h1 className="text-xl font-bold mb-3">Your name</h1>
              <p className="mb-5 text-sm text-muted-foreground">
                This is how others will see you in events.
              </p>
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="max-w-xs mx-auto"
              />
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!name.trim()}>
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step-3" {...motionProps}>
              <Palette className="mx-auto mb-3 h-6 w-6" />
              <h1 className="text-xl font-bold mb-3">Pick a color</h1>
              <p className="mb-5 text-sm text-muted-foreground">
                Choose your avatar color for voting and messaging.
              </p>
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
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={() => setStep(4)}>Preview</Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step-4" {...motionProps}>
              <BadgeCheck className="mx-auto mb-3 h-6 w-6" />
              <h1 className="text-xl font-bold mb-3">Here’s your profile</h1>
              <p className="mb-5 text-sm text-muted-foreground">
                You can update this later in your settings.
              </p>
              <div className="flex flex-col items-center space-y-3">
                <div
                  className={cn("w-16 h-16 rounded-full shadow border", color)}
                />
                <span className="text-lg font-medium">{name}</span>
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button
                  onClick={async () => {
                    await handleNameSubmit();
                    setStep(5);
                  }}
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step-5" {...motionProps}>
              <PartyPopper className="mx-auto mb-3 h-6 w-6" />
              <h1 className="text-xl font-bold mb-3">You're ready!</h1>
              <p className="mb-6 text-sm text-muted-foreground">
                Let’s create your first event or skip for later.
              </p>
              <div className="flex flex-col gap-3">
                <Button onClick={() => router.push("/app/create-event")}>
                  Create Event
                </Button>
                <Button variant="outline" onClick={finishOnboarding}>
                  Go to Dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
