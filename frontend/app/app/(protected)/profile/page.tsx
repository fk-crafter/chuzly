"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const [profile, setProfile] = useState<{
    name: string;
    plan: string;
    trialEndsAt?: string | null;
  } | null>(null);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/lougiin";
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
      });
  }, []);

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete account");

      localStorage.clear();
      window.location.href = "/lougiin";
    } catch (err) {
      console.error("Delete account failed:", err);
    }
  };

  if (!profile) {
    return <p className="text-center mt-20">Loading profile...</p>;
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-3xl font-bold text-center">My Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{profile.name}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Plan</span>
            <Badge
              className={
                profile.plan === "PRO"
                  ? "bg-yellow-400 text-black"
                  : "bg-green-200 text-green-800"
              }
            >
              {profile.plan}
            </Badge>
          </div>

          {profile.plan === "TRIAL" && profile.trialEndsAt && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Trial ends on</span>
              <span className="font-medium">
                {new Date(profile.trialEndsAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-4 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/lougiin";
          }}
        >
          Log out
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account</AlertDialogTitle>
              <AlertDialogDescription>
                This action is irreversible. Type <strong>DELETE</strong> to
                confirm.
              </AlertDialogDescription>
              <Input
                placeholder="Type DELETE to confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              />
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={confirmText.trim() !== "DELETE"}
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
