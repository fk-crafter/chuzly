"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [confirmText, setConfirmText] = useState("");
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    plan: string;
    avatarColor?: string;
  } | null>(null);
  const [selectedColor, setSelectedColor] = useState("bg-muted");
  const [showSave, setShowSave] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/lougiin");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setProfile({
          name: data.name,
          email: data.email ?? "example@email.com",
          plan: data.plan,
          avatarColor: data.avatarColor || "bg-muted",
        });
        setSelectedColor(data.avatarColor || "bg-muted");
        setLoading(false);
      });
  }, [router]);

  const deleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/delete`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error();

      localStorage.clear();
      router.push("/lougiin");
    } catch {
      console.error("Account deletion failed");
    }
  };

  const saveColor = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/avatar-color`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ color: selectedColor }),
      });

      setShowSave(false);
    } catch {
      console.error("Failed to save color");
    }
  };

  if (loading)
    return (
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-56 w-full" />
      </main>
    );

  const initials = profile!.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const colors = [
    "bg-muted", // default gray
    "bg-[var(--color-pastel-green)]",
    "bg-[var(--color-pastel-blue)]",
    "bg-[var(--color-pastel-yellow)]",
    "bg-[var(--color-pastel-pink)]",
    "bg-[var(--color-pastel-lavender)]",
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
      <h1 className="text-3xl font-bold">Public profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Basic information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="flex items-center gap-6">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center text-xl font-semibold text-primary uppercase transition-all ${selectedColor}`}
            >
              {initials}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-10 h-10 rounded-full border-2 ${
                  selectedColor === color
                    ? "border-black"
                    : "border-transparent"
                } ${color}`}
                onClick={() => {
                  setSelectedColor(color);
                  setShowSave(true);
                }}
              />
            ))}
          </div>

          {showSave && <Button onClick={saveColor}>Save changes</Button>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Full name
              </label>
              <Input value={profile!.name} disabled />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <Input value={profile!.email} disabled />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">
                Plan
              </label>
              <Input value={profile!.plan} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete my account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Type <strong>DELETE</strong> to
              confirm.
            </AlertDialogDescription>
            <Input
              placeholder="Type DELETE"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
            />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={confirmText !== "DELETE"}
              onClick={deleteAccount}
            >
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
