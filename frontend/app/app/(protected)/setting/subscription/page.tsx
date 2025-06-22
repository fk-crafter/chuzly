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
    cancelAt?: string | null;
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
      .then((data) =>
        setProfile({
          plan: data.plan,
          trialEndsAt: data.trialEndsAt,
          createdAt: data.createdAt,
          cancelAt: data.cancelAt ?? null,
        })
      )
      .catch(() => toast.error("Failed to load subscription data"));
  }, [router]);

  const handleChoosePlan = () => {
    router.push("/app/setting/choose-plan");
  };

  const handleCancel = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stripe/cancel-subscription`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      setProfile((p) => (p ? { ...p, cancelAt: data.cancelAt } : p));

      toast.success(
        `Your subscription will end on ${new Date(
          data.cancelAt
        ).toLocaleDateString()}`
      );
    } catch (err) {
      toast.error("Failed to cancel subscription");
    }
  };

  if (!profile) {
    return <p className="text-center mt-20">Loading subscription…</p>;
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-center">Subscription</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-base">
          <Row label="Current Plan">
            <Badge
              className={
                profile.plan === "PRO"
                  ? "bg-yellow-400 text-black"
                  : "bg-green-200 text-green-800"
              }
            >
              {profile.plan}
            </Badge>
          </Row>

          {profile.plan === "TRIAL" && profile.trialEndsAt && (
            <Row label="Trial ends on">
              {new Date(profile.trialEndsAt).toLocaleDateString()}
            </Row>
          )}

          <Row label="Account created on">
            {new Date(profile.createdAt).toLocaleDateString()}
          </Row>

          {profile.cancelAt && (
            <Row label="Subscription ends on">
              {new Date(profile.cancelAt).toLocaleDateString()}
            </Row>
          )}

          <div className="pt-4 flex gap-4 flex-wrap">
            <Button onClick={handleChoosePlan} className="w-full md:w-fit">
              {profile.plan === "PRO" ? "Change plan" : "Upgrade to PRO"}
            </Button>

            {profile.plan === "PRO" && !profile.cancelAt && (
              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-full md:w-fit"
              >
                Cancel subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  );
}
