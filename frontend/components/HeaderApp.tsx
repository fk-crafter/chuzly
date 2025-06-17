"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, ShieldCheck, LogOut } from "lucide-react";

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
        localStorage.setItem("isAdmin", data.isAdmin ? "true" : "false");
      })
      .catch(() => {
        router.push("/lougiin");
      });
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPlan");
    localStorage.removeItem("isAdmin");
    router.push("/lougiin");
  };

  const handleGoToProfile = () => {
    router.push("/app/profile");
  };

  return (
    <header className="flex justify-end items-center gap-4 p-4 border-b border-border bg-white dark:bg-zinc-900">
      <Badge className="bg-green-200" variant="secondary">
        Connected
      </Badge>
      {userName && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-sm">
              {userName}
              {userPlan === "PRO" && (
                <Badge className="bg-yellow-400 text-black" variant="secondary">
                  PRO
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleGoToProfile}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            {typeof window !== "undefined" &&
              localStorage.getItem("isAdmin") === "true" && (
                <DropdownMenuItem onClick={() => router.push("/app/admin")}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </DropdownMenuItem>
              )}

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
