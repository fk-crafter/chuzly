"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AppHeader() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");

    if (!token) {
      router.push("/login");
    } else {
      setUserName(name);
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
      {userName && (
        <span className="text-sm text-muted-foreground">{userName}</span>
      )}
      <Button onClick={handleLogout} variant="outline">
        Log out
      </Button>
    </header>
  );
}
