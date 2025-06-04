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
    const name = localStorage.getItem("userName");
    const plan = localStorage.getItem("userPlan");

    if (!token) {
      router.push("/login");
    } else {
      setUserName(name);
      setUserPlan(plan);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPlan");
    router.push("/login");
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
