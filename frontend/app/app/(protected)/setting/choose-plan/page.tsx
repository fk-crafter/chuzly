"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

type Profile = {
  plan: "FREE" | "TRIAL" | "PRO";
  cancelAt?: string | null;
};

export default function ChoosePlanPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/lougiin");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) =>
        setProfile({ plan: data.plan, cancelAt: data.cancelAt ?? null })
      )
      .catch(() => toast.error("Unable to load current plan"));
  }, [router]);

  const handleSelectPlan = async (plan: "FREE" | "PRO") => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    if (plan === "FREE") {
      if (profile?.plan === "FREE") {
        toast.info("Free plan is already active.");
      } else if (profile?.cancelAt) {
        toast.info(
          `You are already scheduled to switch to Free on ${new Date(
            profile.cancelAt
          ).toLocaleDateString()}.`
        );
      } else {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stripe/cancel-subscription`,
          { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        toast.success(
          `Your plan will switch to Free on ${new Date(
            data.cancelAt
          ).toLocaleDateString()}.`
        );
        setProfile((p) => (p ? { ...p, cancelAt: data.cancelAt } : p));
      }
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stripe/checkout-session`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.message || "Checkout failed");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to start checkout session");
    }
  };

  const openPortal = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stripe/portal-session`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      window.location.href = data.url;
    } catch {
      toast.error("Unable to open Stripe portal");
    }
  };

  if (!profile) {
    return <p className="text-center mt-20">Loading plans…</p>;
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-center">Choose your plan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlanCard
          title="Free Plan"
          features={["Create 2 events/month", "Invite guests"]}
          price="$0 / month"
          current={profile.plan === "FREE"}
          disabled={!!profile.cancelAt}
          message={
            profile.cancelAt
              ? `You will be switched to Free on ${new Date(
                  profile.cancelAt!
                ).toLocaleDateString()}`
              : null
          }
          onSelect={() => handleSelectPlan("FREE")}
        />

        <PlanCard
          title="Pro Plan"
          features={["Unlimited events/month", "Access to chat"]}
          price="$9.99 / month"
          current={profile.plan === "PRO"}
          onSelect={() => handleSelectPlan("PRO")}
        >
          {profile.plan === "PRO" && (
            <Button variant="link" className="w-full mt-1" onClick={openPortal}>
              Manage subscription
            </Button>
          )}
        </PlanCard>
      </div>
    </main>
  );
}

function PlanCard({
  title,
  features,
  price,
  current,
  onSelect,
  disabled = false,
  message,
  children,
}: {
  title: string;
  features: string[];
  price: string;
  current: boolean;
  onSelect: () => void;
  disabled?: boolean;
  message?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {features.map((f) => (
          <Feature key={f} label={f} />
        ))}
        <p className="font-bold text-lg mt-4">{price}</p>

        <Button
          className="w-full mt-4"
          variant={current ? "secondary" : "outline"}
          onClick={onSelect}
          disabled={current || disabled}
        >
          {current ? "Current plan" : "Select this plan"}
        </Button>

        {message && (
          <p className="text-xs text-muted-foreground text-center mt-1">
            {message}
          </p>
        )}

        {children}
      </CardContent>
    </Card>
  );
}

function Feature({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-2 text-sm">
      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
      {label}
    </p>
  );
}
