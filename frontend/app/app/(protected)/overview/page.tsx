"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Users, CheckCircle, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

type OverviewStats = {
  totalEvents: number;
  totalVotes: number;
  totalGuests: number;
  upcomingEvents: number;
};

type UpcomingEvent = {
  id: string;
  name: string;
  votingDeadline: string; // ISO
  guestsCount: number;
  votesCount: number;
};

export default function OverviewPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [upcoming, setUpcoming] = useState<UpcomingEvent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fmt = (n: number) =>
    n >= 1000 ? Intl.NumberFormat("en", { notation: "compact" }).format(n) : n;

  const dateFmt = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // stats
        const s = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/overview`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!s.ok) throw new Error("Failed to fetch stats");
        const sJson = (await s.json()) as OverviewStats;
        setStats(sJson);

        // upcoming events (limite 5)
        const u = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/upcoming?limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (u.ok) {
          const uJson = (await u.json()) as UpcomingEvent[];
          setUpcoming(uJson);
        } else {
          setUpcoming([]); // évite le loader infini si 404/pas d’endpoint
        }
      } catch (err) {
        console.error("Failed to fetch overview data", err);
        setUpcoming([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
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
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-9 w-24" />
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-5 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-40 mb-3" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className={contentClasses}>
      <h1 className="text-3xl font-bold">Overview</h1>

      {/* KPI cards */}
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

      {/* Upcoming deadlines list */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Upcoming deadlines</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/app/event-list")}
            >
              Manage
            </Button>
          </div>

          {upcoming && upcoming.length > 0 ? (
            <div className="space-y-3">
              {upcoming.map((ev) => {
                const rate =
                  ev.guestsCount > 0
                    ? Math.round((ev.votesCount / ev.guestsCount) * 100)
                    : 0;

                const barColor =
                  rate === 100
                    ? "bg-green-600"
                    : rate >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500";

                return (
                  <div
                    key={ev.id}
                    className="border rounded-lg p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{ev.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Deadline: {dateFmt(ev.votingDeadline)}
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/app/share?id=${encodeURIComponent(ev.id)}`
                          )
                        }
                      >
                        Manage
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">
                        {ev.votesCount}/{ev.guestsCount} voted
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-white",
                          barColor
                        )}
                      >
                        {rate}% done
                      </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn("h-full transition-all", barColor)}
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No upcoming deadlines.
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
