"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, Plus } from "lucide-react";
import SettingSidebar from "./SettingSidebar";
import SidebarAdmin from "./SidebarAdmin";

export default function Sidebar() {
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/app/admin");
  const isSettingPage = pathname.startsWith("/app/setting");

  if (isAdminPage) return <SidebarAdmin />;
  if (isSettingPage) return <SettingSidebar />;

  const navItems = [
    { href: "/app/overview", label: "Overview", icon: LayoutDashboard },
    { href: "/app/event-list", label: "Events", icon: Calendar },
  ];

  return (
    <>
      <aside className="hidden md:flex w-64 bg-white dark:bg-zinc-900 border-r flex-col">
        <div className="p-4 h-16 flex items-center justify-between border-b">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Chuzly</h1>
            <p className="text-xs text-muted-foreground">Plan. Vote. Share.</p>
          </div>
          <Link href="/app/create-event">
            <button
              className="p-2 rounded-md bg-primary text-white hover:bg-primary/90 transition"
              title="Create Event"
            >
              <Plus className="w-5 h-5" />
            </button>
          </Link>
        </div>

        <nav className="px-4 py-4 flex-1">
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
      </aside>

      <div className="fixed z-50 bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t flex justify-between items-center px-6 py-2 md:hidden">
        <Link
          href="/app/overview"
          className={cn(
            "flex flex-col items-center text-xs font-medium",
            pathname === "/app/overview"
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <LayoutDashboard className="w-5 h-5 mb-1" />
          Overview
        </Link>

        <Link href="/app/create-event">
          <button
            className="p-4 rounded-full bg-primary text-white hover:bg-primary/90 transition -translate-y-6 shadow-lg"
            title="Create"
          >
            <Plus className="w-5 h-5" />
          </button>
        </Link>

        <Link
          href="/app/event-list"
          className={cn(
            "flex flex-col items-center text-xs font-medium",
            pathname === "/app/event-list"
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <Calendar className="w-5 h-5 mb-1" />
          Events
        </Link>
      </div>
    </>
  );
}
