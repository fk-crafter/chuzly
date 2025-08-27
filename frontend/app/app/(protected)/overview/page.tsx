"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Users, CheckCircle, BarChart3 } from "lucide-react";

type OverviewStats = {
  totalEvents: number;
  totalVotes: number;
  totalGuests: number;
  upcomingEvents: number;
};

export default function OverviewPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fmt = (n: number) =>
    n >= 1000 ? Intl.NumberFormat("en", { notation: "compact" }).format(n) : n;

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/overview`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = (await res.json()) as OverviewStats;
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch overview stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const contentClasses = "max-w-6xl mx-auto px-4 py-16 space-y-10 lg:ml-64";

  if (loading || !stats) {
    return (
      <div className={contentClasses}>
        <h1 className="text-3xl font-bold">Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="shadow-md">
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-10 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className={contentClasses}>
      <h1 className="text-3xl font-bold">Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <CalendarCheck className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Total Events</span>
            </div>
            <div className="text-3xl font-bold">{fmt(stats.totalEvents)}</div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Total Votes</span>
            </div>
            <div className="text-3xl font-bold">{fmt(stats.totalVotes)}</div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Guests</span>
            </div>
            <div className="text-3xl font-bold">{fmt(stats.totalGuests)}</div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium">Upcoming Deadlines</span>
            </div>
            <div className="text-3xl font-bold">
              {fmt(stats.upcomingEvents)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Upcoming deadlines</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/app/event-list")}
            >
              Manage
            </Button>
          </div>

          {stats.upcomingEvents > 0 ? (
            <div className="text-sm text-muted-foreground">
              You have {stats.upcomingEvents} event
              {stats.upcomingEvents > 1 ? "s" : ""} ending soon. Don’t forget to
              share the link with your guests.
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>No deadlines soon. You’re all caught up</span>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
