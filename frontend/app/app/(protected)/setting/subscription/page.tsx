"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SubscriptionPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<{
    plan: string;
    trialEndsAt?: string | null;
    createdAt: string;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/lougiin");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile({
          plan: data.plan,
          trialEndsAt: data.trialEndsAt,
          createdAt: data.createdAt,
        });
      })
      .catch(() => {
        toast.error("Failed to load subscription data");
      });
  }, [router]);

  if (!profile) {
    return <p className="text-center mt-20">Loading subscription...</p>;
  }

  const handleManagePlan = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/billing/portal`;
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-center">Subscription</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-base">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Current Plan</span>
            <Badge
              className={
                profile.plan === "PRO"
                  ? "bg-yellow-400 text-black"
                  : "bg-green-200 text-green-800"
              }
            >
              {profile.plan}
            </Badge>
          </div>

          {profile.plan === "TRIAL" && profile.trialEndsAt && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Trial ends on</span>
              <span className="font-medium">
                {new Date(profile.trialEndsAt).toLocaleDateString()}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Account created on</span>
            <span className="font-medium">
              {new Date(profile.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="pt-4">
            <Button onClick={handleManagePlan} className="w-full md:w-fit">
              {profile.plan === "PRO"
                ? "Manage subscription"
                : "Upgrade to PRO"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
