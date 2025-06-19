"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

type Profile = { plan: "FREE" | "TRIAL" | "PRO" };

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
      .then((data) => setProfile({ plan: data.plan }))
      .catch(() => toast.error("Unable to load current plan"));
  }, [router]);

  const handleSelectPlan = (plan: "FREE" | "PRO") => {
    toast.info(`Selected plan: ${plan} (no action yet)`);
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
          onSelect={() => handleSelectPlan("FREE")}
        />

        <PlanCard
          title="Pro Plan"
          features={["Unlimited events", "Access to chat"]}
          price="$9.99 / month"
          current={profile.plan === "PRO"}
          onSelect={() => handleSelectPlan("PRO")}
        />
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
}: {
  title: string;
  features: string[];
  price: string;
  current: boolean;
  onSelect: () => void;
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
          disabled={current}
        >
          {current ? "Current plan" : "Select this plan"}
        </Button>
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
