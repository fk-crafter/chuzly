"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BarChart2, Users, Settings } from "lucide-react";

const adminNavItems = [
  {
    href: "/app/admin",
    label: "Dashboard",
    icon: BarChart2,
  },
  {
    href: "/app/admin/users",
    label: "Manage Users",
    icon: Users,
  },
  {
    href: "/app/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function SidebarAdmin() {
  const pathname = usePathname();

  return (
    <>
      {/* 🖥 Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-zinc-900 border-r h-screen flex-col">
        <div className="p-6 border-b">
          <h1 className="text-lg font-semibold tracking-tight">Admin Panel</h1>
          <p className="text-xs text-muted-foreground">Admin controls</p>
        </div>

        <ScrollArea className="flex-1">
          <nav className="px-4 py-6 space-y-2">
            {adminNavItems.map(({ href, label, icon: Icon }) => (
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
      </aside>

      {/* 📱 Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white dark:bg-zinc-900 border shadow-xl rounded-t-2xl flex justify-around items-center z-50 py-3 px-2">
        {adminNavItems.map(({ href, label, icon: Icon }) => {
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
