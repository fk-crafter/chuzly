"use client";

import { useEffect, useState } from "react";

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
    <main className="max-w-xl mx-auto px-4 py-16 space-y-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="space-y-2 text-lg">
        <p>
          <strong>Name:</strong> {profile.name}
        </p>
        <p>
          <strong>Plan:</strong> {profile.plan}
        </p>
        {profile.plan === "TRIAL" && profile.trialEndsAt && (
          <p>
            <strong>Trial ends at:</strong>{" "}
            {new Date(profile.trialEndsAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </main>
  );
}
