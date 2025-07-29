"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<{
    totalEvents: number;
    totalVotes: number;
    totalGuests: number;
    upcomingEvents: number;
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const user = await userRes.json();

        if (!user.hasOnboarded) {
          router.push("/app/onboarding");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/overview`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    fetchStats();
  }, [router]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);

  if (!stats) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-8 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-8 text-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
        Welcome back! 👋
      </h1>
      <p className="text-muted-foreground mb-6">
        Ready to create a new event or manage your current ones?
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
        <Button
          className="w-full sm:w-auto"
          onClick={() => router.push("/app/create-event")}
        >
          Create new event
        </Button>
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => router.push("/app/event-list")}
        >
          View my events
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Total Events</h2>
            <p className="text-3xl font-bold mt-2">{stats.totalEvents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Total Votes</h2>
            <p className="text-3xl font-bold mt-2">{stats.totalVotes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Total Guests</h2>
            <p className="text-3xl font-bold mt-2">{stats.totalGuests}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>
            <p className="text-base mt-2">
              {stats.upcomingEvents} events ending soon
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
