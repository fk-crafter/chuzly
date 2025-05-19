"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Calendar, Clock, DollarSign } from "lucide-react";

export function ShareEventPageClient() {
  const params = useSearchParams();
  const [event, setEvent] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const raw = params.get("data");
    if (!raw) return;

    try {
      const decoded = JSON.parse(decodeURIComponent(raw));
      setEvent(decoded);
    } catch (err) {
      console.error("Invalid data");
    }
  }, [params]);

  const handleCopy = (link: string, guest: string) => {
    navigator.clipboard.writeText(link);
    setCopied(guest);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!event) {
    return <p className="text-center mt-20">Loading event data...</p>;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-2xl font-bold">Share your event</h1>

      <div>
        <h2 className="text-lg font-semibold mb-2">{event.eventName}</h2>
        <ul className="text-sm text-muted-foreground space-y-4">
          {event.options.map((opt: any, i: number) => (
            <li key={i}>
              <div className="font-medium mb-1">{opt.name}</div>
              <div className="text-xs flex flex-col gap-1">
                {opt.datetime && (
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(opt.datetime).toLocaleDateString()}
                  </span>
                )}
                {opt.datetime && (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {new Date(opt.datetime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
                {opt.price && (
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {opt.price ? `$${opt.price}` : "Free"}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Guest links</h2>
        <ul className="space-y-3">
          {event.guests.map((guest: string, i: number) => {
            const voteData = {
              ...event,
              guest,
              votes: event.votes || {},
            };
            const url = `/app/vote?data=${encodeURIComponent(
              JSON.stringify(voteData)
            )}&guest=${guest}`;

            return (
              <li key={i} className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleCopy(url, guest)}
                  className="w-full justify-between"
                >
                  {guest}'s link
                  {copied === guest ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
