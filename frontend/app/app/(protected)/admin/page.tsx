"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminUser } from "./types";
import { useAdminActions } from "./useAdminActions";
import { UserTable } from "./UserTable";
import { UserCard } from "./UserCard";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { updatePlan, updateRole, deleteUser } = useAdminActions();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialog, setDialog] = useState<null | {
    type: "plan" | "role";
    userId: string;
    newValue: string;
    currentValue: string;
  }>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin");

    if (!token || isAdmin !== "true") {
      router.push("/app/profile");
      return;
    }

    async function fetchUsers() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error();

        setUsers(await res.json());
      } catch (err) {
        router.push("/app/profile");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [router]);

  const confirmChange = async () => {
    if (!dialog) return;

    try {
      if (dialog.type === "plan") {
        const updated = await updatePlan(dialog.userId, dialog.newValue as any);
        setUsers((prev) =>
          prev.map((u) => (u.id === dialog.userId ? updated.user : u))
        );
      } else {
        const updated = await updateRole(dialog.userId, dialog.newValue as any);
        setUsers((prev) =>
          prev.map((u) => (u.id === dialog.userId ? updated.user : u))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDialog(null);
    }
  };

  const askChange = (
    userId: string,
    type: "plan" | "role",
    newValue: string,
    currentValue: string
  ) => {
    setDialog({ userId, type, newValue, currentValue });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;

    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      console.error("Fail delete");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading users...</p>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <UserTable
        users={users}
        onPlanChange={(id, plan) =>
          askChange(id, "plan", plan, users.find((u) => u.id === id)!.plan)
        }
        onRoleChange={(id, to) =>
          askChange(
            id,
            "role",
            to,
            users.find((u) => u.id === id)!.isAdmin ? "Admin" : "User"
          )
        }
        onDelete={handleDelete}
      />

      <div className="md:hidden space-y-4 mt-6">
        {users.map((u) => (
          <UserCard
            key={u.id}
            user={u}
            onPlanChange={(id, plan) => askChange(id, "plan", plan, u.plan)}
            onRoleChange={(id, to) =>
              askChange(id, "role", to, u.isAdmin ? "Admin" : "User")
            }
            onDelete={handleDelete}
          />
        ))}
      </div>

      <AlertDialog
        open={dialog !== null}
        onOpenChange={(o) => !o && setDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm change</AlertDialogTitle>
            <AlertDialogDescription>
              Change {dialog?.type} from <strong>{dialog?.currentValue}</strong>{" "}
              to <strong>{dialog?.newValue}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
