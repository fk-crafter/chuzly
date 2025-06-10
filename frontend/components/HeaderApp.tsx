"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AppHeader() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/lougiin");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUserName(data.name);
        setUserPlan(data.plan);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userPlan", data.plan);
      })
      .catch(() => {
        router.push("/lougiin");
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPlan");
    router.push("/lougiin");
  };

  return (
    <header className="flex justify-end items-center gap-4 p-4 border-b border-border bg-white dark:bg-zinc-900">
      <Badge className="bg-green-200" variant="secondary">
        Connected
      </Badge>
      {userName && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{userName}</span>
          {userPlan === "PRO" && (
            <Badge className="bg-yellow-400 text-black" variant="secondary">
              PRO
            </Badge>
          )}
        </div>
      )}
      <Button onClick={handleLogout} variant="outline">
        Log out
      </Button>
    </header>
  );
}
