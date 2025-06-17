"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
            headers: { Authorization: `Bearer ${token}` },
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
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete user");

      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Error deleting user", err);
    }
  };

  const handleChangeRole = async (
    userId: string,
    toAdmin: boolean,
    current: boolean
  ) => {
    const newRole = toAdmin ? "Admin" : "User";
    const oldRole = current ? "Admin" : "User";
    const confirmed = window.confirm(
      `Are you sure you want to change the role from ${oldRole} to ${newRole}?`
    );
    if (!confirmed) return;

    const url = toAdmin
      ? `/admin/users/${userId}/promote`
      : `/admin/users/${userId}/demote`;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) throw new Error("Failed to change role");

      const updated = await res.json();
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updated.user : user))
      );
    } catch (err) {
      console.error("Role update error", err);
    }
  };

  const handleChangePlan = async (
    userId: string,
    plan: string,
    current: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to change the plan from ${current} to ${plan}?`
    );
    if (!confirmed) return;

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

  if (loading) {
    return <p className="text-center mt-20">Loading users...</p>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-zinc-800">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Plan</th>
              <th className="p-3 font-medium">Trial Ends</th>
              <th className="p-3 font-medium">Admin</th>
              <th className="p-3 font-medium">Created</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-muted">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <Badge variant="outline">{user.plan}</Badge>
                </td>
                <td className="p-3">
                  {user.trialEndsAt
                    ? new Date(user.trialEndsAt).toLocaleDateString()
                    : "-"}
                </td>
                <td className="p-3">{user.isAdmin ? "Yes" : "No"}</td>
                <td className="p-3">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 space-x-2 flex flex-wrap">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(user.id)}
                    disabled={user.isAdmin}
                  >
                    Delete
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline">
                        Role
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {!user.isAdmin ? (
                        <DropdownMenuItem
                          onClick={() =>
                            handleChangeRole(user.id, true, user.isAdmin)
                          }
                        >
                          Make Admin
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() =>
                            handleChangeRole(user.id, false, user.isAdmin)
                          }
                        >
                          Make User
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline">
                        Plan
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {["TRIAL", "FREE", "PRO"].map((plan) => (
                        <DropdownMenuItem
                          key={plan}
                          onClick={() =>
                            handleChangePlan(user.id, plan, user.plan)
                          }
                          disabled={user.plan === plan}
                        >
                          {plan}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
