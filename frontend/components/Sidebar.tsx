"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Home, Plus } from "lucide-react";

import SidebarAdmin from "./SidebarAdmin";
import SettingSidebar from "./SettingSidebar";

const userNavItems = [
  {
    href: "/app/create-event",
    label: "Create Event",
    icon: Plus,
  },
  {
    href: "/app/event-list",
    label: "My Events",
    icon: Home,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/app/admin");
  const isSettingPage = pathname.startsWith("/app/setting");

  if (isAdminPage) return <SidebarAdmin />;
  if (isSettingPage) return <SettingSidebar />;

  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r flex flex-col">
      <div className="p-4 h-16 flex items-center border-b">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Chuzly</h1>
          <p className="text-xs text-muted-foreground">Plan. Vote. Share.</p>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <nav className="px-4 py-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 px-1">
            Navigation
          </p>
          <div className="space-y-1">
            {userNavItems.map(({ href, label, icon: Icon }) => {
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
      </ScrollArea>

      <Separator />
    </aside>
  );
}
