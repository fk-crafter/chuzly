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
    <header className="flex items-center justify-between p-4 border-b border-border bg-white dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <Badge variant="secondary">Connected</Badge>
        <span className="text-sm text-muted-foreground">
          {userEmail ? userEmail : "Loading..."}
        </span>
      </div>

      <Button onClick={handleLogout} variant="outline">
        Log out
      </Button>
    </header>
  );
}
