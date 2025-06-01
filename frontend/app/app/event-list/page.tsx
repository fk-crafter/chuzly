"use client";

import { useEffect, useState } from "react";

export default function MyEventsPage() {
  const [events, setEvents] = useState<
    {
      id: string;
      name: string;
      createdAt: string;
      votesCount: number;
      guestsCount: number;
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

  if (loading) {
    return <p className="text-center mt-20">Loading your events...</p>;
  }

  if (events.length === 0) {
    return (
      <p className="text-center mt-20">You haven’t created any events yet.</p>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-8">My Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="border rounded-lg p-4 shadow-sm bg-white dark:bg-zinc-900"
          >
            <h2 className="text-lg font-semibold mb-2">{event.name}</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Created on: {new Date(event.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm">
              Progress: <strong>{event.votesCount}</strong> /{" "}
              {event.guestsCount} guests voted
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
