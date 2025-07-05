"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { PartyPopper, Trash, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
  const [direction, setDirection] = useState(1);

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
    const utcDeadline = new Date(votingDeadline).toISOString();
    const body = { eventName, votingDeadline: utcDeadline, options, guests };

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

  const progressPercent = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        <span className="flex items-center justify-center gap-2">
          <PartyPopper className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          Create a new event
        </span>
      </h1>

      <div className="md:hidden w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
        <div
          className="bg-primary h-2 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Event name</Label>
                <Input
                  className="w-full max-w-sm"
                  placeholder="Saturday plans"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
              <div>
                <Label className="mb-2 block">Voting deadline</Label>
                <Input
                  type="datetime-local"
                  className="w-full max-w-sm"
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
                className="border p-4 rounded-lg bg-muted grid md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end"
              >
                <div className="flex-1 w-full">
                  <Label>Name</Label>
                  <Input
                    placeholder="Ex: Pizza night"
                    value={opt.name}
                    onChange={(e) =>
                      handleOptionChange(i, "name", e.target.value)
                    }
                  />
                </div>
                <div className="flex-1 w-full">
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
                <div className="flex-1 w-full">
                  <Label>Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={opt.datetime}
                    onChange={(e) =>
                      handleOptionChange(i, "datetime", e.target.value)
                    }
                  />
                </div>
                <div className="flex items-end h-full">
                  {i > 0 ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(i)}
                    >
                      <Trash className="w-4 h-4 mt-3 text-red-500" />
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </CardContent>
        </Card>

        <div className="flex justify-center pt-6">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              onClick={handleSubmit}
              className="w-full md:w-auto px-12 py-6 text-lg"
            >
              Next →
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="md:hidden space-y-8 relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{
                x: direction === 1 ? 100 : -100,
                opacity: 0,
                scale: 0.95,
              }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{
                x: direction === 1 ? -100 : 100,
                opacity: 0,
                scale: 0.95,
              }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
              className="absolute w-full"
            >
              <div className="w-full">
                <Label className="text-sm mb-2 block">Event name</Label>
                <Input
                  placeholder="Saturday plans"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="py-4 text-base"
                />
                <Label className="text-sm mt-6 mb-2 block">
                  Voting deadline
                </Label>
                <Input
                  type="datetime-local"
                  value={votingDeadline}
                  onChange={(e) => setVotingDeadline(e.target.value)}
                  className="py-4 text-base"
                />
                <Button
                  className="w-full mt-8 py-4 text-base"
                  onClick={() => {
                    setDirection(1);
                    setTimeout(() => setStep(2), 0);
                  }}
                >
                  Next →
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{
                x: direction === 1 ? 100 : -100,
                opacity: 0,
                scale: 0.95,
              }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{
                x: direction === 1 ? -100 : 100,
                opacity: 0,
                scale: 0.95,
              }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
              className="absolute w-full"
            >
              <div className="w-full space-y-6">
                {options.map((opt, i) => (
                  <div
                    key={i}
                    className="border p-4 rounded-xl bg-muted space-y-4"
                  >
                    <div>
                      <Label className="text-sm">Name</Label>
                      <Input
                        placeholder="Ex: Pizza night"
                        value={opt.name}
                        onChange={(e) =>
                          handleOptionChange(i, "name", e.target.value)
                        }
                        className="py-4 text-base"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Price</Label>
                      <Input
                        type="number"
                        placeholder="Ex: 20"
                        value={opt.price}
                        onChange={(e) =>
                          handleOptionChange(i, "price", e.target.value)
                        }
                        className="py-4 text-base"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Date & Time</Label>
                      <Input
                        type="datetime-local"
                        value={opt.datetime}
                        onChange={(e) =>
                          handleOptionChange(i, "datetime", e.target.value)
                        }
                        className="py-4 text-base"
                      />
                    </div>
                    {i > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(i)}
                        className="self-end"
                      >
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addOption}
                  className="w-full py-4 text-base"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add option
                </Button>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDirection(-1);
                      setTimeout(() => setStep(1), 0);
                    }}
                    className="w-1/2 py-4 text-base"
                  >
                    ← Previous
                  </Button>
                  <Button
                    onClick={() => {
                      setDirection(1);
                      setTimeout(() => setStep(3), 0);
                    }}
                    className="w-1/2 py-4 text-base"
                  >
                    Next →
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{
                x: direction === 1 ? 100 : -100,
                opacity: 0,
                scale: 0.95,
              }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{
                x: direction === 1 ? -100 : 100,
                opacity: 0,
                scale: 0.95,
              }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
              className="absolute w-full"
            >
              <div className="w-full space-y-6">
                {guests.map((g, i) => (
                  <Input
                    key={i}
                    placeholder="Nickname"
                    value={g}
                    onChange={(e) => handleGuestChange(i, e.target.value)}
                    className="py-4 text-base"
                  />
                ))}
                <Button
                  variant="outline"
                  onClick={addGuest}
                  className="w-full py-4 text-base"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add guest
                </Button>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDirection(-1);
                      setTimeout(() => setStep(2), 0);
                    }}
                    className="w-1/2 py-4 text-base"
                  >
                    ← Previous
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    className="w-1/2 py-4 text-base"
                  >
                    Finish →
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
