// app/components/SettingSidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CreditCard, ListOrdered, UserCog } from "lucide-react";

const settingNav = [
  {
    href: "/app/setting/subscription",
    label: "Subscription",
    icon: CreditCard,
  },
  {
    href: "/app/setting/choose-plan",
    label: "Choose Plan",
    icon: ListOrdered,
  },
  {
    href: "/app/setting/profile",
    label: "Profile",
    icon: UserCog,
  },
  // ajoute d’autres liens si nécessaire
];

export default function SettingSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r h-screen flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold tracking-tight">Settings</h2>
        <p className="text-xs text-muted-foreground">Manage your account</p>
      </div>

      <ScrollArea className="flex-1">
        <nav className="px-4 py-6 space-y-2">
          {settingNav.map(({ href, label, icon: Icon }) => (
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
  );
}
