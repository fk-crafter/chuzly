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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<null | {
    type: "plan" | "role";
    userId: string;
    newValue: string;
    currentValue: string;
  }>(null);

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

  const confirmChange = async () => {
    if (!dialog) return;

    const { userId, type, newValue } = dialog;

    try {
      const url =
        type === "plan"
          ? `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/plan`
          : newValue === "Admin"
          ? `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/promote`
          : `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/demote`;

      const options: RequestInit =
        type === "plan"
          ? {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({ plan: newValue }),
            }
          : {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            };

      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated.user : u)));
    } catch (err) {
      console.error("Update error", err);
    } finally {
      setDialog(null);
    }
  };

  const handleDelete = async (userId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;

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

      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Delete user failed", err);
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Loading users...</p>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-zinc-800">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Email Verified</th>
              <th className="p-3 font-medium">Onboarded</th>
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
                  <Badge
                    variant={user.emailVerified ? "default" : "destructive"}
                  >
                    {user.emailVerified ? "Yes" : "No"}
                  </Badge>
                </td>
                <td className="p-3">
                  <Badge variant={user.hasOnboarded ? "default" : "secondary"}>
                    {user.hasOnboarded ? "Yes" : "No"}
                  </Badge>
                </td>
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
                            setDialog({
                              type: "role",
                              userId: user.id,
                              currentValue: "User",
                              newValue: "Admin",
                            })
                          }
                        >
                          Make Admin
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() =>
                            setDialog({
                              type: "role",
                              userId: user.id,
                              currentValue: "Admin",
                              newValue: "User",
                            })
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
                            setDialog({
                              type: "plan",
                              userId: user.id,
                              currentValue: user.plan,
                              newValue: plan,
                            })
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

      {/* Mobile */}
      <div className="block md:hidden space-y-4">
        {users.map((user) => (
          <details
            key={user.id}
            className="border rounded-xl p-4 shadow-sm bg-white dark:bg-zinc-900"
          >
            <summary className="cursor-pointer font-medium text-sm">
              {user.name}{" "}
              <span className="text-muted-foreground">({user.email})</span>
            </summary>
            <div className="mt-3 space-y-2 text-sm">
              <p>
                <strong>Plan:</strong>{" "}
                <Badge variant="outline">{user.plan}</Badge>
              </p>
              <p>
                <strong>Trial Ends:</strong>{" "}
                {user.trialEndsAt
                  ? new Date(user.trialEndsAt).toLocaleDateString()
                  : "-"}
              </p>
              <p>
                <strong>Admin:</strong> {user.isAdmin ? "Yes" : "No"}
              </p>
              <p>
                <strong>Email Verified:</strong>{" "}
                {user.emailVerified ? "Yes" : "No"}
              </p>
              <p>
                <strong>Onboarded:</strong> {user.hasOnboarded ? "Yes" : "No"}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>

              <div className="flex flex-col gap-2 pt-2">
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
                      Change Role
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {!user.isAdmin ? (
                      <DropdownMenuItem
                        onClick={() =>
                          setDialog({
                            type: "role",
                            userId: user.id,
                            currentValue: "User",
                            newValue: "Admin",
                          })
                        }
                      >
                        Make Admin
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() =>
                          setDialog({
                            type: "role",
                            userId: user.id,
                            currentValue: "Admin",
                            newValue: "User",
                          })
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
                      Change Plan
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["TRIAL", "FREE", "PRO"].map((plan) => (
                      <DropdownMenuItem
                        key={plan}
                        onClick={() =>
                          setDialog({
                            type: "plan",
                            userId: user.id,
                            currentValue: user.plan,
                            newValue: plan,
                          })
                        }
                        disabled={user.plan === plan}
                      >
                        {plan}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </details>
        ))}
      </div>

      <AlertDialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change {dialog?.type} from{" "}
              <strong>{dialog?.currentValue}</strong> to{" "}
              <strong>{dialog?.newValue}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialog(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
