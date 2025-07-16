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
import { motion, AnimatePresence } from "motion/react";
import { Pencil } from "lucide-react";

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

  const [nameInput, setNameInput] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [selectedColor, setSelectedColor] = useState("bg-muted");
  const [hoveringAvatar, setHoveringAvatar] = useState(false);
  const [showSaveColor, setShowSaveColor] = useState(false);

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
        setNameInput(data.name);
        setSelectedColor(data.avatarColor || "bg-muted");
        setLoading(false);
      });
  }, [router]);

  const saveName = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/update-name`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nameInput }),
      });

      setProfile((prev) => prev && { ...prev, name: nameInput });
      setEditingName(false);
    } catch {
      console.error("Failed to update name");
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
      setShowSaveColor(false);
    } catch {
      console.error("Failed to save color");
    }
  };

  const deleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.clear();
      router.push("/lougiin");
    } catch {
      console.error("Account deletion failed");
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
    "bg-muted",
    "bg-[var(--color-pastel-green)]",
    "bg-[var(--color-pastel-blue)]",
    "bg-[var(--color-pastel-yellow)]",
    "bg-[var(--color-pastel-pink)]",
    "bg-[var(--color-pastel-lavender)]",
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
      <h1 className="text-3xl font-bold text-center md:text-left">
        Public profile
      </h1>

      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Basic information</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center md:items-start space-y-8">
          <div
            className="relative flex flex-col items-center md:flex-row md:items-center gap-4 w-full"
            onMouseEnter={() => setHoveringAvatar(true)}
            onMouseLeave={() => setHoveringAvatar(false)}
          >
            <div
              className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-xl font-semibold text-primary uppercase transition-all ${selectedColor}`}
            >
              {initials}
            </div>

            <AnimatePresence>
              {hoveringAvatar && (
                <motion.div
                  className="gap-2 hidden md:flex absolute md:static left-32"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-10 h-10 rounded-full border-2 ${
                        selectedColor === color
                          ? "border-black"
                          : "border-transparent"
                      } ${color}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColor(color);
                        setShowSaveColor(true);
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {showSaveColor && (
            <Button onClick={saveColor} className="w-full max-w-[300px]">
              Save avatar color
            </Button>
          )}

          <div className="w-full flex flex-col items-center md:grid md:grid-cols-2 gap-6">
            <div className="space-y-1 w-full max-w-[300px]">
              <label className="text-sm font-medium text-muted-foreground text-left w-full">
                Full name
              </label>
              <div className="flex items-center gap-2 w-full">
                <Input
                  value={nameInput}
                  disabled={!editingName}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full"
                />
                <Pencil
                  className="w-4 h-4 opacity-60 hover:opacity-100 cursor-pointer transition"
                  onClick={() => setEditingName(true)}
                />
              </div>
              {editingName && (
                <Button onClick={saveName} size="sm" className="w-full mt-1">
                  Save name
                </Button>
              )}
            </div>

            <div className="space-y-1 w-full max-w-[300px]">
              <label className="text-sm font-medium text-muted-foreground text-left w-full">
                Email
              </label>
              <Input
                value={profile!.email}
                disabled
                className="w-full truncate"
              />
            </div>

            <div className="space-y-1 w-full max-w-[300px] md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground text-left w-full">
                Plan
              </label>
              <Input value={profile!.plan} disabled className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="hidden md:block w-full max-w-[300px] mx-auto"
          >
            Delete my account
          </Button>
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

      <div className="flex md:hidden flex-col items-center">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-semibold text-primary uppercase ${selectedColor}`}
        >
          {initials}
        </div>

        <div className="flex gap-2 flex-wrap justify-center mt-4">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-10 h-10 rounded-full border-2 ${
                selectedColor === color ? "border-black" : "border-transparent"
              } ${color}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColor(color);
                setShowSaveColor(true);
              }}
            />
          ))}
        </div>

        {showSaveColor && (
          <Button onClick={saveColor} className="w-full max-w-[300px] mt-2">
            Save avatar color
          </Button>
        )}

        <div className="w-full space-y-6 mt-8">
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <div className="flex items-center gap-2">
              <Input
                value={nameInput}
                disabled={!editingName}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full"
              />
              <Pencil
                className="w-4 h-4 opacity-60 hover:opacity-100 cursor-pointer transition"
                onClick={() => setEditingName(true)}
              />
            </div>
            {editingName && (
              <Button onClick={saveName} size="sm" className="w-full mt-1">
                Save name
              </Button>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <Input value={profile!.email} disabled className="w-full" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">
              Plan
            </label>
            <Input value={profile!.plan} disabled className="w-full" />
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full mt-8">
              Delete my account
            </Button>
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
      </div>
    </main>
  );
}
