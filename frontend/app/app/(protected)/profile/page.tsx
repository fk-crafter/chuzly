"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [profile, setProfile] = useState<{
    name: string;
    plan: string;
    trialEndsAt?: string | null;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
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

      <div className="flex justify-center pt-4">
        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userName");
            localStorage.removeItem("userPlan");
            window.location.href = "/login";
          }}
        >
          Log out
        </Button>
      </div>
    </main>
  );
}
