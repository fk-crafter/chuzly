"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, CreditCard } from "lucide-react";
import { motion } from "motion/react";
import { HandWaving } from "phosphor-react";
import { cn } from "@/lib/utils";

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

  if (!profile) return <p className="text-center mt-20">Loading profile…</p>;

  return (
    <main className="px-6 py-10 md:pl-64">
      <div className="max-w-6xl mx-auto">
        {/* Desktop */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="flex justify-center">
              <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">
                  Account overview
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Welcome back,{" "}
                  <span className="font-medium">{profile.name}</span>.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-6">
                <InfoCard
                  href="/app/setting/profile"
                  icon={<User className="w-5 h-5" />}
                  title="Profile settings"
                  description="Update your personal information, name & avatar."
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <InfoCard
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

              <div className="col-span-12">
                <div className="rounded-2xl border bg-muted/40 p-6">
                  <h3 className="font-semibold text-lg mb-1">Plan details</h3>
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
              </div>
            </div>
          </motion.div>
        </div>

        {/* mobile */}
        <div className="block md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-3xl font-semibold text-white">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-xl font-bold mt-4">{profile.name}</h1>
              <p className="text-sm text-muted-foreground">
                Welcome <HandWaving className="w-4 h-4 inline-block" />
              </p>
            </div>

            <div className="space-y-4">
              <InfoCard
                href="/app/setting/profile"
                icon={<User className="w-5 h-5" />}
                title="Profile Settings"
                description="Update your name, avatar, and personal info."
                compact
              />
              <InfoCard
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
                compact
              />
            </div>

            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-semibold text-base mb-2">Plan Details</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You are currently on the{" "}
                <span className="font-medium">{profile.plan}</span> plan.
              </p>
              <Link href="/app/setting/subscription">
                <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition text-sm w-full">
                  Manage Subscription
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  href,
  icon,
  title,
  description,
  compact,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-2xl border bg-card shadow-sm transition hover:shadow-md hover:border-primary/60",
        compact ? "p-4" : "p-6"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-xl border bg-background p-2 text-primary">
          {icon}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold group-hover:text-primary transition">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
}
