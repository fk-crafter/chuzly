"use client";

import { Button } from "@/components/ui/button";

const pricingPlans = [
  {
    title: "Starter",
    price: "Free",
    features: ["Create events", "Share with a link", "Basic voting"],
    highlighted: false,
  },
  {
    title: "Pro",
    price: "$9.99/mo",
    features: ["Unlimited events", "Access to chat"],
    highlighted: true,
  },
  {
    title: "Team",
    price: "$9.99/mo",
    features: ["Team dashboards", "Multiple organizers", "Analytics"],
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section className="relative w-full py-32 px-4 bg-background text-center overflow-hidden">
      <div className="absolute -rotate-12 left-[-50%] top-1/2 w-[200%] z-50 bg-yellow-400 py-4 shadow-lg border-t border-b border-yellow-600">
        <p className="text-black font-extrabold text-xl tracking-widest">
          ⚠ COMING SOON ⚠ COMING SOON ⚠ COMING SOON ⚠
        </p>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
        Flexible pricing for every group
      </h2>
      <p className="text-muted-foreground text-lg mb-16">
        From casual plans to big gatherings — choose a plan that fits the way
        you organize.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan) => (
          <div
            key={plan.title}
            className={`relative bg-muted rounded-2xl px-6 py-10 text-left border border-border overflow-hidden ${
              plan.highlighted ? "md:scale-105 border-primary shadow-lg" : ""
            }`}
          >
            <div className="absolute inset-0 backdrop-blur-[6px] bg-white/60 z-10 rounded-2xl" />

            <div className="relative z-0 opacity-40 pointer-events-none select-none">
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
                variant={plan.highlighted ? "default" : "outline"}
              >
                Select
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
