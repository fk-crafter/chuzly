"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/complete-onboarding`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    router.push("/app/dashboard");
  };

  return (
    <main className="max-w-xl mx-auto py-20 px-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to Chuzly 🎉</h1>
      <p className="mb-8 text-muted-foreground">
        Let’s quickly set up your profile so you can start creating events!
      </p>
      <Button onClick={handleComplete}>Finish onboarding</Button>
    </main>
  );
}
