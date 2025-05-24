"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function VotePageClient() {
  const params = useSearchParams();
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const eventId = params.get("id");
  const guest = params.get("guest");

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId || !guest) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/guest/${guest}`
        );
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error("Failed to fetch event", err);
      }
    };

    fetchEvent();
  }, [eventId, guest]);

  const handleVote = async () => {
    if (!selectedOption || !eventId || !guest) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/guest/${guest}/vote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ choice: selectedOption }),
        }
      );
      alert("Vote submitted!");
      router.refresh();
    } catch (err) {
      console.error("Vote error", err);
    }
  };

  if (!event) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold mb-2">{event.name}</h1>
        <p className="text-muted-foreground text-sm mb-4">
          Hi {guest}, choose your favorite option 👇
        </p>

        <div className="space-y-4">
          {event.options.map((opt: any) => (
            <div
              key={opt.id}
              onClick={() => setSelectedOption(opt.id)}
              className={cn(
                "border rounded-lg px-4 py-3 cursor-pointer hover:bg-accent transition",
                selectedOption === opt.id && "border-primary bg-muted"
              )}
            >
              <p className="font-medium">{opt.name}</p>
              <div className="text-sm text-muted-foreground space-y-1 mt-1">
                {opt.datetime && (
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(opt.datetime).toLocaleString()}
                  </p>
                )}
                {opt.price && (
                  <p>
                    <strong>Price:</strong> ${opt.price}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button onClick={handleVote} disabled={!selectedOption}>
          Submit vote
        </Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Who's voted?</h2>
        <ul className="space-y-2 text-sm">
          {event.guests.map((g: any) => (
            <li key={g.nickname} className="flex items-center justify-between">
              <span>{g.nickname}</span>
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  g.vote
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {g.vote ? "Voted" : "Pending"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
