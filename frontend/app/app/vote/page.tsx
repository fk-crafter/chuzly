"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function VotePageClient() {
  const params = useSearchParams();
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

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

        const currentGuest = data.guests.find((g: any) => g.nickname === guest);
        const currentVote = currentGuest?.vote;

        if (
          currentVote?.name === "Not available" &&
          !data.options.find((opt: any) => opt.id === currentVote.id)
        ) {
          data.options.push({
            id: currentVote.id,
            name: "Not available",
            price: null,
            datetime: null,
          });
        }

        setEvent(data);

        if (currentVote?.id) {
          setSelectedOption(currentVote.id);
          setHasVoted(true);
        } else {
          setSelectedOption(null);
          setHasVoted(false);
        }
      } catch (err) {
        console.error("Failed to fetch event", err);
        toast.error("Failed to load event.");
      }
    };

    fetchEvent();
  }, [eventId, guest]);

  const handleVote = async () => {
    if (!eventId || !guest) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/guest/${guest}/vote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ choice: selectedOption }),
        }
      );
      setHasVoted(true);
      toast.success("Vote submitted!");
      router.refresh();
    } catch (err) {
      console.error("Vote error", err);
      toast.error("Vote failed");
    }
  };

  const handleCancelVote = async () => {
    if (!eventId || !guest) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/guest/${guest}/vote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ choice: null }),
        }
      );
      setSelectedOption(null);
      setHasVoted(false);
      toast.success("Vote canceled");
      router.refresh();
    } catch (err) {
      console.error("Cancel vote error", err);
      toast.error("Failed to cancel");
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
              onClick={() =>
                setSelectedOption((prev) => (prev === opt.id ? null : opt.id))
              }
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

        <div className="flex gap-4 mt-4 flex-wrap">
          <Button onClick={handleVote} disabled={selectedOption === null}>
            Submit vote
          </Button>

          <Button
            variant="secondary"
            onClick={() => setSelectedOption("unavailable")}
            disabled={hasVoted}
          >
            I'm unavailable
          </Button>

          {hasVoted && (
            <Button variant="outline" onClick={handleCancelVote}>
              Cancel vote
            </Button>
          )}
        </div>
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
                  g.vote?.name === "Not available"
                    ? "bg-yellow-100 text-yellow-700"
                    : g.vote
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {g.vote?.name === "Not available"
                  ? "Unavailable"
                  : g.vote
                  ? "Voted"
                  : "Pending"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
