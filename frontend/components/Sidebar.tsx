"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Plus,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  LogOut,
  Settings,
  CalendarPlus,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import SidebarAdmin from "./SidebarAdmin";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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
        localStorage.setItem("userName", d.name);
        localStorage.setItem("userPlan", d.plan);
        localStorage.setItem("isAdmin", d.isAdmin ? "true" : "false");
        localStorage.setItem("avatarColor", d.avatarColor || "bg-muted");
        if (d.email) localStorage.setItem("userEmail", d.email);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
      });
    } catch {}
    localStorage.clear();
    router.push("/login");
  };

  const initials =
    userName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "";

  const isAdminPage = pathname.startsWith("/app/admin");
  if (isAdminPage) return <SidebarAdmin />;

  const navMain = [
    { href: "/app/overview", label: "Overview", icon: LayoutDashboard },
    { href: "/app/event-list", label: "Events", icon: Calendar },
  ];

  const footerMenuItems = [
    {
      label: "Subscription",
      icon: CreditCard,
      onClick: () => router.push("/app/setting/subscription"),
    },
    {
      label: "Account settings",
      icon: Settings,
      onClick: () => router.push("/app/setting"),
    },
    ...(isAdmin
      ? [
          {
            label: "Admin Dashboard",
            icon: ShieldCheck,
            onClick: () => router.push("/app/admin"),
          },
        ]
      : []),
    {
      label: "Log out",
      icon: LogOut,
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-zinc-900 border-r flex-col z-40">
        <div className="p-4 h-16 flex items-center justify-between border-b shrink-0">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Chuzly.</h1>
            <p className="text-xs text-muted-foreground">Plan. Vote. Share.</p>
          </div>
          <Link href="/app/create-event" title="Create Event">
            <button className="p-2 rounded-md bg-primary text-white hover:bg-primary/90 transition">
              <Plus className="w-5 h-5" />
            </button>
          </Link>
        </div>

        <nav className="px-4 py-4 overflow-y-auto">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">
            Navigation
          </p>
          <div className="space-y-1">
            {navMain.map(({ href, label, icon: Icon }) => {
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

        <div className="mt-auto border-t p-4 shrink-0 pb-[calc(env(safe-area-inset-bottom)+8px)]">
          {userPlan === "FREE" && (
            <Link href="/app/setting/choose-plan">
              <Button className="w-full mb-3">Upgrade to PRO</Button>
            </Link>
          )}

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
                {footerMenuItems.map(({ label, icon: Icon, onClick }) => (
                  <DropdownMenuItem key={label} onClick={onClick}>
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </DropdownMenuItem>
                ))}
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
      <div className="fixed z-50 bottom-4 left-4 md:hidden">
        <button
          className="p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              key="panel"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-zinc-900 z-50 shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-bold tracking-tight">Chuzly.</h1>
                  <p className="text-[11px] text-muted-foreground">
                    Plan. Vote. Share.
                  </p>
                </div>
                <button
                  className="text-muted-foreground"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4">
                <p className="px-2 mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                  Navigation
                </p>

                <div className="space-y-1 mb-4">
                  <Link
                    href="/app/create-event"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === "/app/create-event"
                        ? "bg-primary text-white"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <CalendarPlus className="w-5 h-5 opacity-80" />
                    Create Event
                  </Link>

                  <Link
                    href="/app/event-list"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === "/app/event-list"
                        ? "bg-primary text-white"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <Calendar className="w-5 h-5 opacity-80" />
                    Events
                  </Link>

                  <Link
                    href="/app/overview"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === "/app/overview"
                        ? "bg-primary text-white"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <LayoutDashboard className="w-5 h-5 opacity-80" />
                    Overview
                  </Link>
                </div>

                {userPlan === "FREE" && (
                  <Link
                    href="/app/setting/choose-plan"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button className="w-full mb-4">Upgrade to PRO</Button>
                  </Link>
                )}
              </div>

              <div className="mt-auto pt-3 border-t px-3 pb-[calc(env(safe-area-inset-bottom)+10px)]">
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

                    <DropdownMenuContent align="start" className="w-64">
                      {footerMenuItems.map(({ label, icon: Icon, onClick }) => (
                        <DropdownMenuItem
                          key={label}
                          onClick={() => {
                            setIsOpen(false);
                            onClick();
                          }}
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          {label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    Loading profile…
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
