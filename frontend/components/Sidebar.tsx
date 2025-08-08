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

import SettingSidebar from "./SettingSidebar";
import SidebarAdmin from "./SidebarAdmin";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // ==== user state (ex-AppHeader) ====
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
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUserName(data.name);
        setUserPlan(data.plan);
        setAvatarColor(data.avatarColor || "bg-muted");
        setIsAdmin(!!data.isAdmin);
        // keep your localStorage mirroring if you need it elsewhere
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userPlan", data.plan);
        localStorage.setItem("isAdmin", data.isAdmin ? "true" : "false");
        localStorage.setItem("avatarColor", data.avatarColor || "bg-muted");
      })
      .catch(() => {
        // ignore — layout can still render
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
      });
    } catch (_) {}
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

  // ==== route-specific sidebars ====
  const isAdminPage = pathname.startsWith("/app/admin");
  const isSettingPage = pathname.startsWith("/app/setting");
  if (isAdminPage) return <SidebarAdmin />;
  if (isSettingPage) return <SettingSidebar />;

  const navItems = [
    { href: "/app/overview", label: "Overview", icon: LayoutDashboard },
    { href: "/app/event-list", label: "Events", icon: Calendar },
  ];

  // ====== DESKTOP ======
  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-zinc-900 border-r flex-col z-40">
        {/* Top brand + Quick create */}
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

        {/* Nav (scrollable zone) */}
        <nav className="px-4 py-4 flex-1 overflow-y-auto">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">
            Navigation
          </p>
          <div className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
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

        {/* Footer profile (toujours visible) */}
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
                      <div className="flex items-center gap-1 mt-1">
                        {userPlan === "PRO" && (
                          <Badge
                            className="bg-yellow-400 text-black"
                            variant="secondary"
                          >
                            PRO
                          </Badge>
                        )}
                      </div>
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

      {/* FAB to open on mobile */}
      <div className="fixed z-50 bottom-4 left-4 md:hidden">
        <button
          className="p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* ====== MOBILE SHEET ====== */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              key="panel"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-zinc-900 z-50 shadow-lg p-4 flex flex-col"
            >
              <button
                className="self-end mb-4 text-muted-foreground"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Chuzly.</h1>
                  <p className="text-xs text-muted-foreground">
                    Plan. Vote. Share.
                  </p>
                </div>
                <Link href="/app/create-event" onClick={() => setIsOpen(false)}>
                  <button className="p-2 rounded-md bg-primary text-white hover:bg-primary/90 transition">
                    <Plus className="w-5 h-5" />
                  </button>
                </Link>
              </div>

              <div className="space-y-1">
                {navItems.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-white"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn("w-5 h-5", !isActive && "opacity-70")}
                      />
                      {label}
                    </Link>
                  );
                })}
              </div>

              {/* mobile footer profile */}
              <div className="mt-auto pt-4 border-t">
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
                        onClick={() => {
                          setIsOpen(false);
                          router.push("/app/setting");
                        }}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Account settings
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem
                          onClick={() => {
                            setIsOpen(false);
                            router.push("/app/admin");
                          }}
                        >
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          setIsOpen(false);
                          handleLogout();
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="text-xs text-muted-foreground mb-2">
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
