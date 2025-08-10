"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Check, X, Sparkles, Crown, CircleCheck, Info } from "lucide-react";

type Profile = {
  plan: "FREE" | "TRIAL" | "PRO";
  cancelAt?: string | null;
};

type PlanDef = {
  key: "FREE" | "PRO";
  title: string;
  subtitle: string;
  priceLabel: string;
  features: { ok: boolean; text: string }[];
  accent: string;
  icon: React.ReactNode;
  popular?: boolean;
};

const pricingPlans: PlanDef[] = [
  {
    key: "FREE",
    title: "Starter",
    subtitle: "For small plans with friends",
    priceLabel: "Free",
    features: [
      { ok: true, text: "Create events" },
      { ok: true, text: "Share with a link" },
      { ok: true, text: "Basic voting (dates & places)" },
    ],
    accent: "from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    key: "PRO",
    title: "Pro",
    subtitle: "Everything you need to plan fast",
    priceLabel: "$10.99/mo",
    features: [
      { ok: true, text: "Unlimited events" },
      { ok: true, text: "Access to chat" },
    ],
    accent:
      "from-primary/15 via-primary/5 to-background dark:from-primary/20 dark:via-primary/10 dark:to-background",
    icon: <Crown className="w-5 h-5" />,
    popular: true,
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
    if (!token) return toast.error("You must be logged in.");

    if (planKey === "FREE") {
      if (profile?.plan === "FREE")
        return toast.info("Free plan is already active.");
      if (profile?.cancelAt) {
        return toast.info(
          `You're already scheduled to switch to Free on ${new Date(
            profile.cancelAt
          ).toLocaleDateString()}.`
        );
      }
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
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stripe/checkout-session`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok && data.url) window.location.href = data.url;
      else throw new Error(data.message || "Checkout failed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to start checkout session");
    }
  };

  const handleCancelScheduledDowngrade = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stripe/undo-cancel`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed");
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
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      window.location.href = data.url;
    } catch {
      toast.error("Unable to open Stripe portal");
    }
  };

  if (!profile) return <p className="text-center mt-20">Loading plans…</p>;

  return (
    <main className="px-6 py-10 md:pl-64">
      {" "}
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Choose Your Plan
        </h1>

        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6">
          {pricingPlans.map((plan) => {
            const isCurrent = profile.plan === plan.key;
            const isFree = plan.key === "FREE";
            const disabled = isCurrent || (isFree && !!profile.cancelAt);

            return (
              <div
                key={plan.key}
                className={cn(
                  "relative group rounded-2xl border bg-gradient-to-b",
                  plan.accent,
                  "shadow-sm transition hover:shadow-md"
                )}
              >
                <div className="absolute inset-0 rounded-2xl ring-1 ring-border group-hover:ring-primary/40 transition" />

                {plan.popular && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-white shadow-md">
                      Most popular
                    </span>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-3 py-1 text-xs font-medium shadow">
                      <CircleCheck className="w-3.5 h-3.5" />
                      Current plan
                    </span>
                  </div>
                )}

                <div className="relative z-10 p-6 md:p-8 text-left flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="rounded-md bg-background/70 p-2 border">
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{plan.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-5">
                    {plan.subtitle}
                  </p>

                  <div className="mb-6">
                    <div className="text-3xl font-bold">{plan.priceLabel}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {plan.key === "PRO" ? "Cancel anytime" : "Forever free"}
                    </p>
                  </div>

                  <ul className="space-y-2 text-sm mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        {f.ok ? (
                          <Check className="mt-[2px] w-4 h-4 text-green-600" />
                        ) : (
                          <X className="mt-[2px] w-4 h-4 text-muted-foreground/50" />
                        )}
                        <span
                          className={cn(
                            "leading-5",
                            !f.ok && "text-muted-foreground line-through"
                          )}
                        >
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <Button
                      className={cn(
                        "w-full",
                        plan.key === "PRO"
                          ? ""
                          : "bg-background hover:bg-background/80"
                      )}
                      variant={plan.key === "PRO" ? "default" : "outline"}
                      onClick={() => handleSelectPlan(plan.key)}
                      disabled={disabled}
                    >
                      {isCurrent
                        ? "Current plan"
                        : plan.key === "PRO"
                        ? "Start 7-day free trial"
                        : "Select"}
                    </Button>

                    {isFree && profile.cancelAt && (
                      <p className="mt-2 text-[12px] text-muted-foreground flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" />
                        You will be switched to Free on{" "}
                        {new Date(profile.cancelAt).toLocaleDateString()}.
                        <button
                          className="ml-1 underline hover:no-underline"
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
                </div>
              </div>
            );
          })}
        </div>

        <div className="block md:hidden space-y-4">
          <div
            className={cn(
              "rounded-2xl border p-5 bg-gradient-to-b from-primary/10 to-background",
              profile.plan === "PRO" && "ring-1 ring-primary/30"
            )}
          >
            <h3 className="text-lg font-semibold mb-1">Pro</h3>
            <p className="text-xl font-bold mb-1">$10.99 per month</p>
            <p className="text-sm text-muted-foreground mb-4">
              Everything you need to plan fast
            </p>
            <Button
              className="w-full"
              onClick={() => handleSelectPlan("PRO")}
              disabled={profile.plan === "PRO"}
            >
              {profile.plan === "PRO" ? "Current plan" : "Upgrade"}
            </Button>
          </div>

          <div className="rounded-2xl border p-5 bg-gradient-to-b from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
            <h3 className="text-lg font-semibold mb-1">Starter</h3>
            <p className="text-xl font-bold mb-1">Free</p>
            <p className="text-sm text-muted-foreground mb-4">
              For small plans with friends
            </p>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleSelectPlan("FREE")}
              disabled={profile.plan === "FREE"}
            >
              {profile.plan === "FREE" ? "Current plan" : "Select"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
