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
      router.push("/login");
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
    return (
      <p className="text-center mt-20 text-muted-foreground">
        Loading subscription…
      </p>
    );
  }

  const handleUndoCancel = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stripe/undo-cancel`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      setProfile((p) => (p ? { ...p, cancelAt: null } : p));
      toast.success("Cancellation undone. Subscription remains active.");
    } catch (err) {
      toast.error("Failed to undo cancellation");
    }
  };

  return (
    <main className="max-w-xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-center">Your Subscription</h1>

      <div className="hidden md:block">
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Plan Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row label="Current Plan">
              <Badge
                className={
                  profile.plan === "PRO"
                    ? "bg-yellow-300 text-black"
                    : "bg-muted text-foreground"
                }
              >
                {profile.plan}
              </Badge>
            </Row>

            {profile.trialEndsAt && profile.plan === "TRIAL" && (
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

            <div className="pt-6 flex gap-4">
              <Button onClick={handleChoosePlan} className="w-auto">
                {profile.plan === "PRO" ? "Change Plan" : "Upgrade to PRO"}
              </Button>

              {profile.plan === "PRO" &&
                (profile.cancelAt ? (
                  <Button onClick={handleUndoCancel} variant="outline">
                    Undo cancellation
                  </Button>
                ) : (
                  <Button onClick={handleCancel} variant="outline">
                    Cancel subscription
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Version */}
      <div className="block md:hidden px-4 py-6 space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mt-1">Plan Overview</p>
        </div>

        <div className="space-y-4">
          <Row label="Current Plan">
            <Badge
              className={
                profile.plan === "PRO"
                  ? "bg-yellow-300 text-black"
                  : "bg-muted text-foreground"
              }
            >
              {profile.plan}
            </Badge>
          </Row>

          {profile.trialEndsAt && profile.plan === "TRIAL" && (
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
        </div>

        <div className="pt-2 space-y-3">
          <Button
            onClick={handleChoosePlan}
            className="w-full rounded-full text-base py-2.5"
          >
            {profile.plan === "PRO" ? "Change Plan" : "Upgrade to PRO"}
          </Button>

          {profile.plan === "PRO" &&
            (profile.cancelAt ? (
              <Button
                onClick={handleUndoCancel}
                variant="outline"
                className="w-full rounded-full text-base py-2.5"
              >
                Undo cancellation
              </Button>
            ) : (
              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-full rounded-full text-base py-2.5"
              >
                Cancel subscription
              </Button>
            ))}
        </div>
      </div>
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
    <div className="flex items-center justify-between border-b py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  );
}
