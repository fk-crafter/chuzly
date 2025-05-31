"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AppHeader() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");

    if (!token) {
      router.push("/login");
    } else {
      setUserEmail(email);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  return (
    <header className="flex justify-end items-center gap-4 p-4 border-b border-border bg-white dark:bg-zinc-900">
      <Badge variant="secondary">Connected</Badge>
      {userEmail && (
        <span className="text-sm text-muted-foreground">{userEmail}</span>
      )}
      <Button onClick={handleLogout} variant="outline">
        Log out
      </Button>
    </header>
  );
}
