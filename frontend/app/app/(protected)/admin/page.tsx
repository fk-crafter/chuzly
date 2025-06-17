"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin");

    if (!token || isAdmin !== "true") {
      router.push("/app/profile");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users", err);
        router.push("/app/profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const handleDelete = async (userId: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete user");

      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      console.error("Error deleting user", err);
    }
  };

  const handlePromote = async (userId: string) => {
    const confirm = window.confirm("Promote this user to admin?");
    if (!confirm) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/promote`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to promote user");

      const updated = await res.json();
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updated.user : user))
      );
    } catch (err) {
      console.error("Error promoting user", err);
    }
  };

  const handleDemote = async (userId: string) => {
    const confirm = window.confirm("Demote this admin to regular user?");
    if (!confirm) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/demote`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to demote user");

      const updated = await res.json();
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updated.user : user))
      );
    } catch (err) {
      console.error("Error demoting user", err);
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Loading users...</p>;
  }

  const handleChangePlan = async (userId: string, plan: string) => {
    const confirm = window.confirm(`Set plan to ${plan}?`);
    if (!confirm) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/plan`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ plan }),
        }
      );

      if (!res.ok) throw new Error("Failed to update plan");

      const updated = await res.json();
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updated.user : user))
      );
    } catch (err) {
      console.error("Error updating plan", err);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="w-full max-w-xs mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-lg">
                {user.name}
                <div className="text-xs text-muted-foreground">
                  {user.email}
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <div>
                <Badge variant="outline" className="mb-2">
                  {user.plan}
                </Badge>
              </div>
              <div>
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </div>
              {user.trialEndsAt && (
                <div>
                  Trial ends: {new Date(user.trialEndsAt).toLocaleDateString()}
                </div>
              )}
              <div>Admin: {user.isAdmin ? "Yes" : "No"}</div>

              <div className="pt-3 space-y-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                  disabled={user.isAdmin}
                  className="w-full"
                >
                  Delete
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      Change Role
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {!user.isAdmin ? (
                      <DropdownMenuItem onClick={() => handlePromote(user.id)}>
                        Make Admin
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleDemote(user.id)}>
                        Make User
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      Change Plan
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["TRIAL", "FREE", "PRO"].map((planOption) => (
                      <DropdownMenuItem
                        key={planOption}
                        onClick={() => handleChangePlan(user.id, planOption)}
                        disabled={user.plan === planOption}
                      >
                        {planOption}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
