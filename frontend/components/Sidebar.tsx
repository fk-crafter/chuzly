"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Calendar, Plus, Menu, X } from "lucide-react";
import SettingSidebar from "./SettingSidebar";
import SidebarAdmin from "./SidebarAdmin";
import { motion, AnimatePresence } from "motion/react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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

      <div className="fixed z-50 bottom-4 left-4 md:hidden">
        <button
          className="p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition"
          onClick={() => setIsOpen(true)}
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
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              key="panel"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-zinc-900 z-50 shadow-lg p-4 flex flex-col"
            >
              <button
                className="self-end mb-4 text-muted-foreground"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>

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

              <Link
                href="/app/create-event"
                onClick={() => setIsOpen(false)}
                className="mt-4 flex items-center gap-3 p-3 rounded-md bg-primary text-white font-medium"
              >
                <Plus className="w-5 h-5" />
                New Event
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
