"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function VotePageClient() {
  const params = useSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const user = params.get("guest");

  useEffect(() => {
    const raw = params.get("data");
    if (!raw || !user) return;

    try {
      const decoded = JSON.parse(decodeURIComponent(raw));

      const localVotes = JSON.parse(
        localStorage.getItem("togedaVotes") || "{}"
      );

      decoded.votes = {
        ...(decoded.votes || {}),
        ...localVotes,
      };

      setEvent(decoded);
    } catch (err) {
      console.error("Invalid event data");
    }
  }, [params, user]);

  const updateVote = (vote: string | null) => {
    if (!event || !user) return;

    const updatedVotes = {
      ...(event.votes || {}),
    };

    if (vote === null) {
      delete updatedVotes[user];
    } else {
      updatedVotes[user] = vote;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("togedaVotes", JSON.stringify(updatedVotes));
    }

    const updatedEvent = {
      ...event,
      votes: updatedVotes,
    };

    const encoded = encodeURIComponent(JSON.stringify(updatedEvent));
    router.replace(`/app/vote?data=${encoded}&guest=${user}`);
  };

  const handleVote = () => {
    if (!selectedOption) return;
    updateVote(selectedOption);
  };

  const handleUnavailable = () => {
    updateVote("Not available");
  };

  const handleCancelVote = () => {
    updateVote(null);
    setSelectedOption(null);
  };

  if (!event) {
    return <p className="text-center mt-20">Loading event data...</p>;
  }

  const currentVote = event.votes?.[user as string];
  const hasVoted = currentVote !== undefined;

  return (
    <main className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold mb-2">{event.eventName}</h1>
        <p className="text-muted-foreground text-sm mb-4">
          Hi {user}, choose your favorite option 👇
        </p>

        <div className="space-y-4">
          {event.options.map((opt: any, i: number) => (
            <div
              key={i}
              onClick={() => setSelectedOption(opt.name)}
              className={cn(
                "border rounded-lg px-4 py-3 cursor-pointer hover:bg-accent transition",
                selectedOption === opt.name && "border-primary bg-muted"
              )}
            >
              <p className="font-medium">{opt.name}</p>
              <div className="text-sm text-muted-foreground space-y-1 mt-1">
                {opt.datetime && (
                  <p>
                    <span className="inline-block w-16 font-medium">Date:</span>
                    {new Date(opt.datetime).toLocaleString()}
                  </p>
                )}
                {opt.price && (
                  <p>
                    <span className="inline-block w-16 font-medium">
                      Price:
                    </span>
                    ${opt.price}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button onClick={handleVote} disabled={!selectedOption || hasVoted}>
            {hasVoted ? "Vote submitted" : "Submit vote"}
          </Button>

          <Button
            variant="outline"
            onClick={handleUnavailable}
            disabled={hasVoted}
          >
            I’m not available
          </Button>

          {hasVoted && (
            <Button variant="ghost" onClick={handleCancelVote}>
              Cancel vote
            </Button>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Who's voted?</h2>
        <ul className="space-y-2 text-sm">
          {event.guests.map((g: string, i: number) => {
            const vote = event.votes?.[g];
            return (
              <li key={i} className="flex items-center justify-between">
                <span>{g}</span>
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    vote
                      ? vote === "Not available"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-500"
                  )}
                >
                  {vote
                    ? vote === "Not available"
                      ? "Unavailable"
                      : "Voted"
                    : "Pending"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
