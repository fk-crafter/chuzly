"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CreateEventPage() {
  const router = useRouter();

  const [eventName, setEventName] = useState("");
  const [options, setOptions] = useState([
    { name: "", price: "", datetime: "" },
  ]);
  const [guests, setGuests] = useState([""]);

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

  const handleSubmit = async () => {
    const body = {
      eventName,
      options,
      guests,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      router.push(`/app/share?id=${data.id}`);
    } catch (err) {
      console.error("Failed to create event:", err);
      alert("Something went wrong");
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6">Create a new event</h1>

      <div className="mb-6">
        <Label>Event name</Label>
        <Input
          placeholder="Saturday plans"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <Label>Options</Label>
        {options.map((opt, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
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
            />
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addOption}>
          + Add option
        </Button>
      </div>

      <div className="mb-6">
        <Label>Guests</Label>
        {guests.map((g, i) => (
          <Input
            key={i}
            placeholder="Nickname"
            value={g}
            onChange={(e) => handleGuestChange(i, e.target.value)}
            className="mb-2"
          />
        ))}
        <Button type="button" variant="outline" onClick={addGuest}>
          + Add guest
        </Button>
      </div>

      <Button onClick={handleSubmit}>Next</Button>
    </main>
  );
}
