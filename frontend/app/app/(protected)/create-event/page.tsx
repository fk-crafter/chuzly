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

  const [openDetails, setOpenDetails] = useState(true);
  const [openOptions, setOpenOptions] = useState(false);
  const [openGuests, setOpenGuests] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
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
    const utcDeadline = votingDeadline
      ? new Date(votingDeadline).toISOString()
      : null;
    if (!utcDeadline) {
      toast.error("Please select a valid deadline date", {
        className: "bg-red-600 text-white",
      });
      return;
    }
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
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        <span className="flex items-center justify-center gap-2">
          <PartyPopper className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          Create a new event
        </span>
      </h1>

      <div className="hidden md:block space-y-6">
        <Card
          className={`shadow-xl rounded-2xl overflow-hidden transition-all duration-500 ${
            openDetails
              ? "max-h-[600px] opacity-100"
              : "max-h-[64px] opacity-60 overflow-hidden"
          }`}
        >
          <CardHeader
            onClick={() => setOpenDetails(!openDetails)}
            className="cursor-pointer"
          >
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Button
              onClick={() => setOpenOptions(true)}
              className="mt-4 w-full md:w-auto cursor-pointer"
            >
              Next →
            </Button>
          </CardContent>
        </Card>

        <Card
          className={`shadow-xl rounded-2xl overflow-hidden transition-all duration-500 ${
            openOptions
              ? "max-h-[1200px] opacity-100"
              : "max-h-[64px] opacity-60 overflow-hidden"
          }`}
        >
          <CardHeader
            onClick={() => setOpenOptions(!openOptions)}
            className="cursor-pointer"
          >
            <CardTitle>Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {options.map((opt, i) => (
              <div
                key={i}
                className="border p-4 rounded-xl bg-muted grid md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end"
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
                    type="number"
                    placeholder="Ex: 20"
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
                <div className="flex items-end">
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
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                variant="outline"
                onClick={addOption}
                className="w-full md:w-fit cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" /> Add option
              </Button>

              <Button
                onClick={() => setOpenGuests(true)}
                className="w-full md:w-auto cursor-pointer"
              >
                Next →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`shadow-xl rounded-2xl overflow-hidden transition-all duration-500 ${
            openGuests
              ? "max-h-[600px] opacity-100"
              : "max-h-[64px] opacity-60 overflow-hidden"
          }`}
        >
          <CardHeader
            onClick={() => setOpenGuests(!openGuests)}
            className="cursor-pointer"
          >
            <CardTitle>Guests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {guests.map((g, i) => (
                <div key={i} className="relative">
                  <Input
                    placeholder="Nickname"
                    value={g}
                    onChange={(e) => handleGuestChange(i, e.target.value)}
                    className="pr-10"
                  />
                  {guests.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setGuests(guests.filter((_, idx) => idx !== i))
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                variant="outline"
                onClick={addGuest}
                className="w-full md:w-fit cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" /> Add guest
              </Button>

              <Button
                onClick={handleSubmit}
                className="w-full md:w-auto cursor-pointer"
              >
                Finish →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* mobile */}
      <div className="md:hidden space-y-8 relative min-h-[400px]">
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
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
              <div className="flex justify-center pt-8"></div>
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

                <div className="flex gap-4 pb-20 ">
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

                <div className="flex gap-4 ">
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
