"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { PartyPopper, Trash, Plus } from "lucide-react";

export default function CreateEventPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [eventName, setEventName] = useState("");
  const [votingDeadline, setVotingDeadline] = useState("");
  const [options, setOptions] = useState([
    { name: "", price: "", datetime: "" },
  ]);
  const [guests, setGuests] = useState([""]);
  const [step, setStep] = useState(1);

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
  const removeOption = (index: number) =>
    setOptions((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    const body = { eventName, votingDeadline, options, guests };
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        if (res.status === 403) {
          toast.error(
            "Your plan limit has been reached. Please upgrade or wait for next month."
          );
          return;
        }
        throw new Error("Something went wrong");
      }

      const data = await res.json();
      router.push(`/app/share?id=${data.id}`);
    } catch (err) {
      console.error("Failed to create event:", err);
      toast.error("Failed to create event");
    }
  };

  if (checkingAuth)
    return <p className="text-center mt-20">Checking authentication...</p>;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-10 md:space-y-12">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 flex items-center justify-center gap-2">
        <PartyPopper className="w-6 h-6 md:w-8 md:h-8 text-primary" />
        Create a new event
      </h1>

      {(step === 1 || !isMobile) && (
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4">
              <div>
                <Label>Event name</Label>
                <Input
                  placeholder="Saturday plans"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
              <div>
                <Label>Voting deadline</Label>
                <Input
                  type="datetime-local"
                  value={votingDeadline}
                  onChange={(e) => setVotingDeadline(e.target.value)}
                />
              </div>
            </div>
            {isMobile && step === 1 && (
              <Button className="w-full mt-2" onClick={() => setStep(2)}>
                Next →
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {(step === 2 || !isMobile) && (
        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {options.map((opt, i) => (
              <div
                key={i}
                className="border p-4 rounded-lg bg-muted flex flex-col gap-4"
              >
                <div>
                  <Label>Name</Label>
                  <Input
                    placeholder="Ex: Pizza night"
                    value={opt.name}
                    onChange={(e) =>
                      handleOptionChange(i, "name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    placeholder="Ex: 20"
                    type="number"
                    value={opt.price}
                    onChange={(e) =>
                      handleOptionChange(i, "price", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={opt.datetime}
                    onChange={(e) =>
                      handleOptionChange(i, "datetime", e.target.value)
                    }
                  />
                </div>
                <div className="flex justify-end">
                  {i > 0 ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(i)}
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  ) : (
                    <div className="w-10" />
                  )}
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addOption} className="w-fit">
              <Plus className="w-4 h-4 mr-2" /> Add option
            </Button>
            {isMobile && step === 2 && (
              <Button className="w-full mt-2" onClick={() => setStep(3)}>
                Next →
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {(step === 3 || !isMobile) && (
        <Card>
          <CardHeader>
            <CardTitle>Guests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4">
              {guests.map((g, i) => (
                <Input
                  key={i}
                  placeholder="Nickname"
                  value={g}
                  onChange={(e) => handleGuestChange(i, e.target.value)}
                />
              ))}
            </div>
            <Button variant="outline" onClick={addGuest} className="w-fit">
              <Plus className="w-4 h-4 mr-2" /> Add guest
            </Button>
            {isMobile && step === 3 && (
              <Button size="lg" onClick={handleSubmit} className="w-full mt-4">
                Finish →
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {!isMobile && (
        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            onClick={handleSubmit}
            className="w-full md:w-auto px-8 md:px-12 py-5 md:py-6 text-base md:text-lg"
          >
            Next →
          </Button>
        </div>
      )}
    </main>
  );
}
