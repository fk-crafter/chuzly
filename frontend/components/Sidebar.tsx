"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Home, Plus, Share2, BarChart } from "lucide-react";

const navItems = [
  {
    href: "/app/create-event",
    label: "Create Event",
    icon: Plus,
  },
  {
    href: "/app/share",
    label: "Share Event",
    icon: Share2,
  },
  {
    href: "/app/vote",
    label: "Votes Overview",
    icon: BarChart,
  },
  {
    href: "/app/event-list",
    label: "My Events",
    icon: Home,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("userName");
      setUserName(name);
    }
  }, []);

  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-lg font-semibold tracking-tight">Event App</h1>
        <p className="text-xs text-muted-foreground">Plan. Vote. Share.</p>
      </div>

      <ScrollArea className="flex-1">
        <nav className="px-4 py-6 space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 text-sm font-medium px-3 py-2 rounded-lg transition hover:bg-muted hover:text-foreground",
                pathname === href
                  ? "bg-primary text-white"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <Separator />

      <div className="p-4 text-center text-xs text-muted-foreground">
        {userName && (
          <>
            Logged in as
            <br />
            <span className="font-medium">{userName}</span>
          </>
        )}
      </div>
    </aside>
  );
}
