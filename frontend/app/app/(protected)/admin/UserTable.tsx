"use client";

import { AdminUser } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function UserTable({
  users,
  onPlanChange,
  onRoleChange,
  onDelete,
}: {
  users: AdminUser[];
  onPlanChange: (id: string, plan: AdminUser["plan"]) => void;
  onRoleChange: (id: string, to: "Admin" | "User") => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="hidden md:block overflow-x-auto border rounded-xl">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/40 dark:bg-zinc-900/40">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Email Verified</th>
            <th className="p-3 text-left">Onboarded</th>
            <th className="p-3 text-left">Plan</th>
            <th className="p-3 text-left">Trial Ends</th>
            <th className="p-3 text-left">Admin</th>
            <th className="p-3 text-left">Created</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t hover:bg-muted/20">
              <td className="p-3">{u.name}</td>
              <td className="p-3 text-muted-foreground">{u.email}</td>

              <td className="p-3">
                <Badge variant={u.emailVerified ? "default" : "destructive"}>
                  {u.emailVerified ? "Yes" : "No"}
                </Badge>
              </td>

              <td className="p-3">
                <Badge variant={u.hasOnboarded ? "default" : "secondary"}>
                  {u.hasOnboarded ? "Yes" : "No"}
                </Badge>
              </td>

              <td className="p-3">
                <Badge>{u.plan}</Badge>
              </td>

              <td className="p-3">
                {u.trialEndsAt
                  ? new Date(u.trialEndsAt).toLocaleDateString()
                  : "-"}
              </td>

              <td className="p-3">{u.isAdmin ? "Yes" : "No"}</td>

              <td className="p-3">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>

              <td className="p-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-zinc-800"
                    >
                      <span className="text-xl font-bold">⋮</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      onClick={() =>
                        onRoleChange(u.id, u.isAdmin ? "User" : "Admin")
                      }
                    >
                      {u.isAdmin ? "Make User" : "Make Admin"}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      disabled
                      className="opacity-70 pointer-events-none"
                    >
                      ─────────
                    </DropdownMenuItem>

                    {["TRIAL", "FREE", "PRO"].map((p) => (
                      <DropdownMenuItem
                        key={p}
                        disabled={u.plan === p}
                        onClick={() => onPlanChange(u.id, p as any)}
                      >
                        Set {p}
                      </DropdownMenuItem>
                    ))}

                    <DropdownMenuItem
                      disabled
                      className="opacity-70 pointer-events-none"
                    >
                      ─────────
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => onDelete(u.id)}
                      disabled={u.isAdmin}
                    >
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
