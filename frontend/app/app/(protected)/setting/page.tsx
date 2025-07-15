"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

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
      router.push("/lougiin");
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
    <main className="max-w-4xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Account overview</h1>
          <p className="text-muted-foreground">
            Welcome back, <span className="font-medium">{profile.name}</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            href="/app/setting/profile"
            icon={<User className="w-5 h-5" />}
            title="Profile settings"
            description="Update your personal information, name & avatar."
          />

          <Card
            href="/app/setting/subscription"
            icon={<CreditCard className="w-5 h-5" />}
            title="Subscription"
            description={
              profile.plan === "TRIAL" && profile.trialEndsAt
                ? `Trial until ${new Date(
                    profile.trialEndsAt
                  ).toLocaleDateString()}`
                : `Current plan: ${profile.plan}`
            }
          />
        </div>

        <div className="border rounded-xl p-6 bg-muted/50">
          <h3 className="font-semibold text-lg mb-2">Plan details</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You are currently on the{" "}
            <span className="font-medium">{profile.plan}</span> plan.
          </p>
          <Link href="/app/setting/subscription">
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition">
              Manage subscription
            </button>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

function Card({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group block border rounded-xl p-5 bg-background hover:shadow-lg hover:border-primary transition"
    >
      <div className="flex items-center gap-3 text-primary mb-3">{icon}</div>
      <h3 className="font-medium text-lg group-hover:text-primary transition">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}
