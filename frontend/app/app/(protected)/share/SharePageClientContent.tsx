"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Copy, DollarSign, Check } from "lucide-react";

export default function ShareEventPageContent() {
  const params = useSearchParams();
  const [event, setEvent] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const eventId = params.get("id");

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`
        );
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error("Error loading event", err);
      }
    };

    fetchEvent();
  }, [eventId]);

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
        <h2 className="text-lg font-semibold mb-2">{event.name}</h2>
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
                    <DollarSign className="w-4 h-4" />${opt.price}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Guest links</h2>

        <Button
          variant="default"
          onClick={() => {
            const linksText = event.guests
              .map(
                (guest: any) =>
                  `${guest.nickname}: ${window.location.origin}/app/vote?id=${
                    event.id
                  }&guest=${encodeURIComponent(guest.nickname)}`
              )
              .join("\n\n");

            navigator.clipboard.writeText(linksText);
            setCopied("all");
            setTimeout(() => setCopied(null), 2000);
          }}
          className="mb-4"
        >
          {copied === "all" ? "Copied!" : "Copy all guest links"}
        </Button>

        <ul className="space-y-3">
          {event.guests.map((guest: any, i: number) => {
            const voteUrl = `${window.location.origin}/app/vote?id=${event.id}&guest=${guest.nickname}`;

            return (
              <li key={i} className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleCopy(voteUrl, guest.nickname)}
                  className="w-full justify-between"
                >
                  {guest.nickname}'s link
                  {copied === guest.nickname ? (
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
