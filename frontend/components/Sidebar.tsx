"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app/create-event", label: "Create Event" },
  { href: "/app/share", label: "Share Event" },
  { href: "/app/vote", label: "Votes Overview" },
  { href: "/app/event-list", label: "My Events" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-muted border-r px-4 py-6">
      <nav className="space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block text-sm font-medium px-3 py-2 rounded hover:bg-accent transition",
              pathname === item.href && "bg-primary text-white"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
