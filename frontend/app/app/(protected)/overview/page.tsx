"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function OverviewPage() {
  const [stats, setStats] = useState<{
    totalEvents: number;
    totalVotes: number;
    totalGuests: number;
    upcomingEvents: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login"); // redirect si pas loggué
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/overview`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch overview stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  if (loading || !stats) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
        <h1 className="text-2xl font-bold">Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
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
    <main className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-2xl font-bold">Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            <h2 className="text-lg font-semibold">Guests</h2>
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

      <div>
        <h2 className="text-lg font-semibold mt-8">Recent Activity</h2>
        <p className="text-muted-foreground mt-2">
          You can display a list of recent events created, last votes, or recent
          guest sign-ups here.
        </p>
        <Button
          className="mt-4"
          onClick={() => {
            router.push("/app/events");
          }}
        >
          Go to Events
        </Button>
      </div>
    </main>
  );
}
