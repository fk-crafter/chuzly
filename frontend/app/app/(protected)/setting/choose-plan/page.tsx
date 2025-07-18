"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Profile = {
  plan: "FREE" | "TRIAL" | "PRO";
  cancelAt?: string | null;
};

const pricingPlans = [
  {
    title: "Starter",
    price: "Free",
    features: ["Create events", "Share with a link", "Basic voting"],
    key: "FREE",
  },
  {
    title: "Pro",
    price: "$10.99/mo",
    features: ["Unlimited events", "Access to chat"],
    key: "PRO",
  },
];

export default function ChoosePlanPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
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

  const handleSelectPlan = async (planKey: "FREE" | "PRO") => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    if (planKey === "FREE") {
      if (profile?.plan === "FREE") {
        toast.info("Free plan is already active.");
      } else if (profile?.cancelAt) {
        toast.info(
          `You're already scheduled to switch to Free on ${new Date(
            profile.cancelAt
          ).toLocaleDateString()}.`
        );
      } else {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stripe/cancel-subscription`,
          {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
          }
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
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
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

  const handleCancelScheduledDowngrade = async () => {
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

      if (!res.ok) throw new Error("Failed to cancel scheduled downgrade");

      toast.success("Scheduled downgrade canceled. You remain on Pro.");
      setProfile((p) => (p ? { ...p, cancelAt: null } : p));
    } catch {
      toast.error("Unable to cancel scheduled downgrade");
    }
  };

  const openPortal = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stripe/portal-session`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
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
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Choose Your Plan
      </h1>

      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8">
        {pricingPlans.map((plan) => {
          const isCurrent = profile.plan === plan.key;
          const isFree = plan.key === "FREE";
          const disabled = isCurrent || (isFree && !!profile.cancelAt);

          return (
            <div
              key={plan.title}
              className={`bg-muted rounded-2xl px-6 py-10 text-left border border-border ${
                plan.key === "PRO"
                  ? "md:scale-105 border-primary shadow-lg"
                  : ""
              }`}
            >
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {plan.title}
              </h3>
              <p className="text-2xl font-bold mb-4 text-foreground">
                {plan.price}
              </p>
              <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
                {plan.features.map((feature, i) => (
                  <li key={i}>✓ {feature}</li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.key === "PRO" ? "default" : "outline"}
                onClick={() => handleSelectPlan(plan.key as "FREE" | "PRO")}
                disabled={disabled}
              >
                {isCurrent ? "Current plan" : "Select"}
              </Button>

              {isFree && profile.cancelAt && (
                <p className="text-xs text-muted-foreground text-center mt-1">
                  You will be switched to Free on{" "}
                  {new Date(profile.cancelAt).toLocaleDateString()}.{" "}
                  <button
                    className="underline text-blue-400 hover:text-black transition"
                    onClick={handleCancelScheduledDowngrade}
                  >
                    Cancel
                  </button>
                </p>
              )}

              {plan.key === "PRO" && isCurrent && (
                <Button
                  variant="link"
                  className="w-full mt-1 text-center text-sm text-muted-foreground"
                  onClick={openPortal}
                >
                  Manage your subscription
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <div className="block md:hidden space-y-4">
        <div
          className={`border rounded-lg px-4 py-6 ${
            profile.plan === "PRO" ? "border-black bg-black text-white" : ""
          }`}
        >
          <h3 className="text-lg font-semibold mb-1">Pro</h3>
          <p className="text-xl font-bold mb-1">$10.99 per month</p>
          <p className="text-sm mb-4">Advanced features</p>
          <Button
            className="w-full"
            variant="default"
            onClick={() => handleSelectPlan("PRO")}
            disabled={profile.plan === "PRO"}
          >
            {profile.plan === "PRO" ? "Current plan" : "Upgrade"}
          </Button>
        </div>

        <div
          className={`border rounded-lg px-4 py-6 ${
            profile.plan === "FREE" ? "border-black bg-gray-50" : ""
          }`}
        >
          <h3 className="text-lg font-semibold mb-1">Free</h3>
          <p className="text-sm mb-4">Basic features</p>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => handleSelectPlan("FREE")}
            disabled={profile.plan === "FREE"}
          >
            {profile.plan === "FREE" ? "Current plan" : "Downgrade"}
          </Button>
        </div>
      </div>
    </main>
  );
}
