"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Clock } from "lucide-react";

export default function VotePageClientContent() {
  const params = useSearchParams();

  const [event, setEvent] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const eventId = params.get("id");
  const guest = params.get("guest");

  const fetchEvent = useCallback(async () => {
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
  }, [eventId, guest]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchEvent();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchEvent]);

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
      toast.success("Vote submitted!");
      await fetchEvent();
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
      toast.success("Vote canceled");
      await fetchEvent();
    } catch (err) {
      console.error("Cancel vote error", err);
      toast.error("Failed to cancel");
    }
  };

  if (!event) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  const votingClosed =
    event.votingDeadline && new Date(event.votingDeadline) < new Date();

  const voteCounts: Record<string, number> = {};
  for (const guest of event.guests) {
    const voteId = guest.vote?.id;
    if (voteId) {
      voteCounts[voteId] = (voteCounts[voteId] || 0) + 1;
    }
  }

  const totalVotes = Object.values(voteCounts).reduce((sum, n) => sum + n, 0);
  const maxVotes = Math.max(...Object.values(voteCounts), 0);

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold mb-2">{event.name}</h1>
        <p className="text-muted-foreground text-sm mb-4">
          Hi {guest},{" "}
          {votingClosed
            ? "here are the results 👇"
            : "choose your favorite option 👇"}
        </p>

        {event.votingDeadline && (
          <p className="text-sm text-red-600 font-medium mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Voting closes on : {new Date(event.votingDeadline).toLocaleString()}
          </p>
        )}

        <div className="space-y-4">
          {event.options.map((opt: any) => {
            const votes = voteCounts[opt.id] || 0;
            const percentage =
              totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

            const isWinning = votes === maxVotes && maxVotes > 0;
            const isLosing = !isWinning && votes > 0;

            return (
              <div
                key={opt.id}
                onClick={() =>
                  !votingClosed &&
                  setSelectedOption((prev) => (prev === opt.id ? null : opt.id))
                }
                className={cn(
                  "border rounded-lg px-4 py-3 cursor-pointer transition",
                  selectedOption === opt.id &&
                    !votingClosed &&
                    "border-primary bg-muted",
                  votingClosed &&
                    (isWinning
                      ? "border-green-500 bg-green-100"
                      : isLosing
                      ? "border-red-500 bg-red-100"
                      : "opacity-70")
                )}
              >
                <p className="font-medium flex justify-between">
                  {opt.name}
                  {votingClosed && (
                    <span className="text-sm font-normal text-muted-foreground">
                      {percentage}% ({votes} vote{votes !== 1 ? "s" : ""})
                    </span>
                  )}
                </p>

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
            );
          })}
        </div>

        {!votingClosed && (
          <div className="flex gap-4 mt-4 flex-wrap">
            <Button
              onClick={handleVote}
              disabled={selectedOption === null}
              className="cursor-pointer"
            >
              Submit vote
            </Button>
            <Button
              variant="secondary"
              onClick={() => setSelectedOption("unavailable")}
              disabled={hasVoted}
              className="cursor-pointer"
            >
              I'm unavailable
            </Button>
            {hasVoted && (
              <Button
                variant="outline"
                onClick={handleCancelVote}
                className="cursor-pointer"
              >
                Cancel vote
              </Button>
            )}
          </div>
        )}
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
