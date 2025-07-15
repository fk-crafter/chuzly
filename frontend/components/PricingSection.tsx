"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "motion/react";

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  const pricingPlans = [
    {
      title: "Starter",
      price: "Free",
      yearlyPrice: "Free",
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
      yearlyPrice: "$99/year",
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
        className="text-muted-foreground text-lg mb-8"
      >
        From casual plans to big gatherings — choose a plan that fits the way
        you organize.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex items-center justify-center gap-4 mb-16"
      >
        <span
          className={`${
            !isYearly ? "font-bold text-foreground" : "text-muted-foreground"
          }`}
        >
          Monthly
        </span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
        <span
          className={`${
            isYearly ? "font-bold text-foreground" : "text-muted-foreground"
          }`}
        >
          Yearly
        </span>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan) => {
          const shouldAnimatePrice = plan.title === "Pro";
          const displayPrice =
            plan.title === "Pro"
              ? isYearly
                ? plan.yearlyPrice
                : plan.price
              : plan.price;

          return (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <AnimatePresence>
                {plan.title === "Pro" && isYearly && (
                  <motion.div
                    key="ribbon"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 15 }}
                    className="absolute -top-2 -right-3 overflow-hidden w-32 h-32 z-30"
                  >
                    <div className="absolute -right-10 top-12 md:-right-8 md:top-8 w-48 bg-green-500 text-white text-xs font-bold text-center py-1 rotate-45 shadow-lg">
                      Save 25%
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className={`relative bg-muted rounded-2xl px-6 py-10 text-left border border-border overflow-hidden ${
                  plan.highlighted
                    ? "md:scale-105 border-primary shadow-lg"
                    : ""
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

                  {shouldAnimatePrice ? (
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={isYearly ? "yearly" : "monthly"}
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="text-2xl font-bold mb-4 text-foreground"
                      >
                        {displayPrice}
                      </motion.p>
                    </AnimatePresence>
                  ) : (
                    <p className="text-2xl font-bold mb-4 text-foreground">
                      {displayPrice}
                    </p>
                  )}

                  <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
                    {plan.features.map((feature, i) => (
                      <li key={i}>✓ {feature}</li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    Select
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
