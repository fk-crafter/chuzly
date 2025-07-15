"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, CreditCard } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<{
    name: string;
    plan: string;
    trialEndsAt?: string | null;
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
      .then((data) => setProfile(data));
  }, [router]);

  if (!profile) {
    return <p className="text-center mt-20">Loading profile…</p>;
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      <h1 className="text-3xl font-bold text-center">Account settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/app/setting/profile" className="block">
          <CardItem
            icon={<User />}
            title="Profile"
            desc={`Welcome back, ${profile.name}`}
          />
        </Link>

        <Link href="/app/setting/subscription" className="block">
          <CardItem
            icon={<CreditCard />}
            title="Subscription"
            desc={
              profile.plan === "TRIAL" && profile.trialEndsAt
                ? `Plan: ${profile.plan} (trial ends ${new Date(
                    profile.trialEndsAt
                  ).toLocaleDateString()})`
                : `Plan: ${profile.plan}`
            }
          />
        </Link>
      </div>
    </main>
  );
}

function CardItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="border rounded-xl p-5 hover:shadow-md transition bg-muted cursor-pointer">
      <div className="flex items-center gap-3 mb-3 text-primary">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
