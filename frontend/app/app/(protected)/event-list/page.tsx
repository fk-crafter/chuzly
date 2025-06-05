"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2 } from "lucide-react";

export default function EventListPage() {
  const [events, setEvents] = useState<
    {
      id: string;
      name: string;
      createdAt: string;
      votesCount: number;
      guestsCount: number;
      guestLink?: string;
    }[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/mine`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <p className="text-center mt-20 text-muted-foreground">
        You haven’t created any events yet.
      </p>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-10">My Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => {
          const voteRate =
            event.guestsCount > 0
              ? Math.round((event.votesCount / event.guestsCount) * 100)
              : 0;

          return (
            <Card
              key={event.id}
              className="relative hover:shadow-lg transition"
            >
              <button
                onClick={() => handleDelete(event.id)}
                className="absolute top-3 right-3 bg-red-600 text-white rounded-md p-1 hover:bg-red-700 transition cursor-pointer"
              >
                <Trash2 size={16} />
              </button>

              <CardHeader>
                <CardTitle className="text-lg">{event.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Created on {new Date(event.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">
                    {event.votesCount}/{event.guestsCount} guests voted
                  </Badge>
                  <Badge
                    className={
                      voteRate === 100
                        ? "bg-green-600 text-white"
                        : voteRate >= 50
                        ? "bg-yellow-500 text-white"
                        : "bg-red-500 text-white"
                    }
                  >
                    {voteRate}% done
                  </Badge>
                </div>

                <div className="flex gap-2 mt-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => {
                      window.location.href = `/app/share?id=${event.id}`;
                    }}
                  >
                    View Links
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => {
                      if (event.guestLink) {
                        const guest = encodeURIComponent(
                          event.guestLink.split("/guest/")[1]
                        );
                        window.location.href = `/app/vote?id=${event.id}&guest=${guest}`;
                      }
                    }}
                  >
                    View Votes
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
