"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { PartyPopper } from "lucide-react";

export default function CreateEventPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [eventName, setEventName] = useState("");
  const [votingDeadline, setVotingDeadline] = useState("");
  const [options, setOptions] = useState([
    { name: "", price: "", datetime: "" },
  ]);
  const [guests, setGuests] = useState([""]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/lougiin");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const handleOptionChange = (index: number, field: string, value: string) => {
    const updated = [...options];
    updated[index][field as keyof (typeof updated)[number]] = value;
    setOptions(updated);
  };

  const handleGuestChange = (index: number, value: string) => {
    const updated = [...guests];
    updated[index] = value;
    setGuests(updated);
  };

  const addOption = () =>
    setOptions([...options, { name: "", price: "", datetime: "" }]);
  const addGuest = () => setGuests([...guests, ""]);

  const removeOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const body = { eventName, votingDeadline, options, guests };

    const tryCreate = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        if (res.status === 403) return "FORBIDDEN";
        throw new Error("Something went wrong");
      }

      const data = await res.json();
      router.push(`/app/share?id=${data.id}`);
      return "SUCCESS";
    };

    try {
      const result = await tryCreate();
      if (result === "FORBIDDEN") {
        const retry = await tryCreate();
        if (retry === "FORBIDDEN") {
          toast.error(
            "Your plan limit has been reached. Please upgrade or wait for next month."
          );
        }
      }
    } catch (err) {
      console.error("Failed to create event:", err);
      toast.error("Failed to create event");
    }
  };

  if (checkingAuth)
    return <p className="text-center mt-20">Checking authentication...</p>;

  return (
    <main className="max-w-xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        <PartyPopper className="w-8 h-8 text-primary" />
        Create a new event
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Event details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Event name</Label>
              <Input
                placeholder="Saturday plans"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-2 block">Voting deadline</Label>
              <Input
                type="datetime-local"
                value={votingDeadline}
                onChange={(e) => setVotingDeadline(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {options.map((opt, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center"
            >
              <Input
                placeholder="Name"
                value={opt.name}
                onChange={(e) => handleOptionChange(i, "name", e.target.value)}
              />
              <Input
                placeholder="Price"
                value={opt.price}
                type="number"
                onChange={(e) => handleOptionChange(i, "price", e.target.value)}
              />
              <Input
                placeholder="Date & time"
                type="datetime-local"
                value={opt.datetime}
                onChange={(e) =>
                  handleOptionChange(i, "datetime", e.target.value)
                }
                className="min-w-[12rem]"
              />
              {i > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(i)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </Button>
              ) : (
                <div className="w-10" />
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addOption}>
            + Add option
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Guests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {guests.map((g, i) => (
            <Input
              key={i}
              placeholder="Nickname"
              value={g}
              onChange={(e) => handleGuestChange(i, e.target.value)}
            />
          ))}
          <Button type="button" variant="outline" onClick={addGuest}>
            + Add guest
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-6">
        <Button
          size="lg"
          onClick={handleSubmit}
          className="w-full md:w-auto px-12 py-6 text-lg"
        >
          Next →
        </Button>
      </div>
    </main>
  );
}
