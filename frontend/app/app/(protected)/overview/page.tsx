"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Users, CheckCircle, BarChart3 } from "lucide-react";

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
        router.push("/lougiin");
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
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="shadow-md">
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
    <main className="max-w-6xl mx-auto px-4 py-16 space-y-10">
      <div className="text-center space-y-2">
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Here’s a summary of your activity. Track your events, votes, and guest
          engagement in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition">
          <CardContent className="p-6 flex flex-col items-start">
            <CalendarCheck className="w-6 h-6 text-primary mb-2" />
            <h2 className="text-lg font-medium">Total Events</h2>
            <p className="text-3xl font-bold">{stats.totalEvents}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition">
          <CardContent className="p-6 flex flex-col items-start">
            <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
            <h2 className="text-lg font-medium">Total Votes</h2>
            <p className="text-3xl font-bold">{stats.totalVotes}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition">
          <CardContent className="p-6 flex flex-col items-start">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <h2 className="text-lg font-medium">Guests</h2>
            <p className="text-3xl font-bold">{stats.totalGuests}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition">
          <CardContent className="p-6 flex flex-col items-start">
            <CheckCircle className="w-6 h-6 text-purple-600 mb-2" />
            <h2 className="text-lg font-medium">Upcoming Deadlines</h2>
            <p className="text-xl mt-1">{stats.upcomingEvents} ending soon</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 bg-muted/50 rounded-xl p-6 shadow-inner">
        <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
        <p className="text-muted-foreground">
          You can display a list of recent events created, last votes, or recent
          guest sign-ups here.
        </p>
        <Button className="mt-4" onClick={() => router.push("/app/event-list")}>
          Go to Events
        </Button>
      </div>
    </main>
  );
}
