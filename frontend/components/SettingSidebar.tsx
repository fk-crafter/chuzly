"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  ListOrdered,
  User,
  UserCog,
  Plus,
  CalendarPlus,
  ShieldCheck,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const settingNav = [
  { href: "/app/setting", label: "Account overview", icon: User },
  {
    href: "/app/setting/subscription",
    label: "Subscription",
    icon: CreditCard,
  },
  { href: "/app/setting/choose-plan", label: "Choose Plan", icon: ListOrdered },
  { href: "/app/setting/profile", label: "Profile", icon: UserCog },
];

export default function SettingSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [userName, setUserName] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [avatarColor, setAvatarColor] = useState<string>("bg-muted");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setUserName(d.name);
        setUserPlan(d.plan);
        setAvatarColor(d.avatarColor || "bg-muted");
        setIsAdmin(!!d.isAdmin);
      })
      .catch(() => {});
  }, []);

  const initials =
    userName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "";

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
      });
    } catch {}
    localStorage.clear();
    router.push("/login");
  };

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-zinc-900 border-r flex-col z-40">
        <div className="p-4 h-16 flex items-center justify-between border-b shrink-0">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Chuzly.</h1>
            <p className="text-xs text-muted-foreground">Manage your account</p>
          </div>
          <Link href="/app/create-event" title="Create Event">
            <button className="p-2 rounded-md bg-primary text-white hover:bg-primary/90 transition">
              <Plus className="w-5 h-5" />
            </button>
          </Link>
        </div>

        <nav className="px-4 py-4 flex-1 overflow-y-auto">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">
            Settings
          </p>
          <div className="space-y-1">
            {settingNav.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className={cn("w-4 h-4", !isActive && "opacity-70")} />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t p-4 shrink-0">
          {userName ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between text-sm px-2"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center uppercase font-semibold ${avatarColor}`}
                    >
                      {initials}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium leading-none">
                        {userName}
                      </span>
                      {userPlan === "PRO" && (
                        <Badge
                          className="bg-yellow-400 text-black mt-1"
                          variant="secondary"
                        >
                          PRO
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem
                  onClick={() => router.push("/app/create-event")}
                >
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Create Event
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/app/setting")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Account settings
                </DropdownMenuItem>
                {isAdmin && (
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
          ) : (
            <div className="text-xs text-muted-foreground">
              Loading profile…
            </div>
          )}
        </div>
      </aside>

      {/* mobile */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white dark:bg-zinc-900 border shadow-xl rounded-2xl flex justify-around items-center z-50 py-3 px-2">
        {" "}
        {settingNav.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              {label}
            </Link>
          );
        })}
      </div>
    </>
  );
}
