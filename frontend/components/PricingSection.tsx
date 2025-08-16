"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X, Sparkles, Crown, Users, ShieldCheck } from "lucide-react";

export function PricingSection() {
  const plans = useMemo(
    () => [
      {
        id: "starter",
        title: "Starter",
        subtitle: "For small plans with friends",
        priceLabel: "Free",
        priceNote: "Forever free",
        cta: "Start 7-day free trial",
        href: "/create-account",
        accent: "from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950",
        icon: <Sparkles className="w-5 h-5" />,
        popular: false,
        comingSoon: false,
        features: [
          { ok: true, text: "2 events / month" },
          { ok: true, text: "Share with a link" },
          { ok: true, text: "Basic voting (dates & places)" },
        ],
      },
      {
        id: "pro",
        title: "Pro",
        subtitle: "Everything you need to plan fast",
        priceLabel: "$10.99/mo",
        priceNote: "Cancel anytime",
        cta: "Start 7-day free trial",
        href: "/create-account",
        accent:
          "from-primary/15 via-primary/5 to-background dark:from-primary/20 dark:via-primary/10 dark:to-background",
        icon: <Crown className="w-5 h-5" />,
        popular: true,
        comingSoon: false,
        features: [
          { ok: true, text: "Unlimited events" },
          { ok: true, text: "Group chat & polls" },
        ],
      },
      {
        id: "team",
        title: "Team",
        subtitle: "For clubs & organizations",
        priceLabel: "199€",
        priceNote: "Coming soon",
        cta: "",
        href: "#",
        accent:
          "from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-950",
        icon: <Users className="w-5 h-5" />,
        popular: false,
        comingSoon: true,
        features: [
          { ok: true, text: "Team dashboards & roles" },
          { ok: true, text: "Multiple organizers per event" },
          { ok: true, text: "Analytics & exports" },
          { ok: true, text: "SAML SSO & audit logs" },
          { ok: true, text: "Dedicated support" },
        ],
      },
    ],
    []
  );

  return (
    <section
      id="pricing"
      className="relative w-full py-28 px-4 bg-background text-center overflow-hidden"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold mb-4"
      >
        Flexible pricing for every group
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto"
      >
        Start free, upgrade when your plans get bigger. No hidden fees.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className={cn(
              "relative group rounded-2xl border bg-gradient-to-b",
              plan.accent
            )}
          >
            <div className="absolute inset-0 rounded-2xl ring-1 ring-border group-hover:ring-primary/40 transition" />

            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-white shadow-md">
                  Most popular
                </span>
              </div>
            )}

            {plan.comingSoon && (
              <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-[10px] bg-background/55" />

                <div className="absolute left-[-40%] top-1/2 -translate-y-1/2 -rotate-6 w-[180%]">
                  <div className="w-full bg-amber-400 border-y border-amber-500 shadow text-center py-3">
                    <span className="font-extrabold tracking-[0.25em] text-black text-xs md:text-sm">
                      COMING&nbsp;SOON&nbsp;•&nbsp;COMING&nbsp;SOON&nbsp;•&nbsp;COMING&nbsp;SOON
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div
              className={cn(
                "relative z-10 p-6 md:p-8 text-left flex flex-col h-full"
              )}
            >
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
                  {plan.priceNote}
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
                {!plan.comingSoon ? (
                  <Link href={plan.href}>
                    <Button
                      className={cn(
                        "w-full",
                        plan.popular ? "" : "bg-background",
                        plan.popular ? "" : "hover:bg-background/80"
                      )}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <div className="h-10" />
                )}

                {!plan.comingSoon && (
                  <p className="mt-2 text-[12px] text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    No credit card required. Cancel anytime.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-12 grid sm:grid-cols-2 gap-4 text-left">
        <div className="rounded-xl border p-4">
          <p className="text-sm font-medium">7-day free trial</p>
          <p className="text-xs text-muted-foreground">
            Full features, keep your data if you cancel.
          </p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm font-medium">Privacy first</p>
          <p className="text-xs text-muted-foreground">
            We never sell your data. You control sharing.
          </p>
        </div>
      </div>
    </section>
  );
}
