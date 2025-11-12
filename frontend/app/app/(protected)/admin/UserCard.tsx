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

export function UserCard({
  user,
  onDelete,
  onRoleChange,
  onPlanChange,
}: {
  user: AdminUser;
  onDelete: (id: string) => void;
  onRoleChange: (id: string, to: "Admin" | "User") => void;
  onPlanChange: (id: string, plan: AdminUser["plan"]) => void;
}) {
  return (
    <details className="border rounded-xl p-4 shadow-sm bg-white dark:bg-zinc-900">
      <summary className="cursor-pointer font-medium text-sm">
        {user.name}
        <span className="text-muted-foreground"> ({user.email})</span>
      </summary>

      <div className="mt-3 text-sm space-y-2">
        <p>
          <strong>Plan:</strong> <Badge>{user.plan}</Badge>
        </p>

        <p>
          <strong>Email Verified:</strong> {user.emailVerified ? "Yes" : "No"}
        </p>

        <p>
          <strong>Admin:</strong> {user.isAdmin ? "Yes" : "No"}
        </p>

        <p>
          <strong>Created:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            variant="destructive"
            size="sm"
            disabled={user.isAdmin}
            onClick={() => onDelete(user.id)}
          >
            Delete
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                Change Role
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  onRoleChange(user.id, user.isAdmin ? "User" : "Admin")
                }
              >
                {user.isAdmin ? "Make User" : "Make Admin"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                Change Plan
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {["TRIAL", "FREE", "PRO"].map((p) => (
                <DropdownMenuItem
                  key={p}
                  disabled={user.plan === p}
                  onClick={() => onPlanChange(user.id, p as any)}
                >
                  {p}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </details>
  );
}
