"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    plan: string;
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
      .then((r) => r.json())
      .then((data) => {
        setProfile({
          name: data.name,
          email: data.email ?? "example@email.com",
          plan: data.plan,
        });
        setLoading(false);
      });
  }, [router]);

  if (loading)
    return (
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-56 w-full" />
      </main>
    );

  const initials = profile!.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
      <h1 className="text-3xl font-bold">Public profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Basic information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-xl font-semibold text-primary uppercase">
              {initials}
            </div>

            <div className="flex flex-col gap-2">
              <Button variant="secondary" disabled>
                Change picture
              </Button>
              <Button variant="outline" disabled>
                Delete picture
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Full name
              </label>
              <Input value={profile!.name} disabled />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <Input value={profile!.email} disabled />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">
                Plan
              </label>
              <Input value={profile!.plan} disabled />
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
