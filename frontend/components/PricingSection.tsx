"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";

export function PricingSection() {
  const pricingPlans = [
    {
      title: "Starter",
      price: "Free",
      features: [
        "Limited to 2 events per month",
        "Share with a link",
        "Basic voting",
      ],
      highlighted: false,
      comingSoon: false,
    },
    {
      title: "Pro",
      price: "$10.99/mo",
      features: ["Unlimited events", "Access to chat"],
      highlighted: true,
      comingSoon: false,
    },
    {
      title: "Team",
      price: "$250",
      features: ["Team dashboards", "Multiple organizers", "Analytics"],
      highlighted: false,
      comingSoon: true,
    },
  ];

  return (
    <section className="relative w-full py-32 px-4 bg-background text-center overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-foreground mb-6"
      >
        Flexible pricing for every group
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-muted-foreground text-lg mb-12"
      >
        From casual plans to big gatherings — choose a plan that fits the way
        you organize.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan) => (
          <motion.div
            key={plan.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div
              className={`relative bg-muted rounded-2xl px-6 py-10 text-left border border-border overflow-hidden ${
                plan.highlighted ? "md:scale-105 border-primary shadow-lg" : ""
              }`}
            >
              {plan.comingSoon && (
                <>
                  <div className="absolute inset-0 backdrop-blur-[6px] bg-white/60 z-10 rounded-2xl" />
                  <div className="absolute -rotate-12 left-[-50%] top-1/2 w-[200%] z-20 bg-yellow-400 py-4 shadow-lg border-t border-b border-yellow-600">
                    <p className="text-black font-extrabold text-xl tracking-widest">
                      ⚠ COMING SOON ⚠ COMING SOON ⚠ COMING SOON ⚠
                    </p>
                  </div>
                </>
              )}

              <div
                className={`relative ${
                  plan.comingSoon
                    ? "opacity-40 pointer-events-none select-none"
                    : "z-0"
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
                <Link href="/create-account">
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    Try 7-day free trial
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
