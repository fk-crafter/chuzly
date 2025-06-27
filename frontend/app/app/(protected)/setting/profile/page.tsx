"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [confirmText, setConfirmText] = useState("");
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    plan: string;
  } | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/lougiin");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setForm({ name: data.name, email: data.email ?? "" });
        setLoading(false);
      });
  }, [router]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Profile updated");
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/delete`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error();

      localStorage.clear();
      router.push("/lougiin");
    } catch {
      console.error("Account deletion failed");
    }
  };

  if (loading)
    return (
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-56 w-full" />
      </main>
    );

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
      <h1 className="text-3xl font-bold">Public profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Basic information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Full name
              </label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <Input
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">
                Plan
              </label>
              <Input value={profile!.plan} disabled />
            </div>
          </div>

          <Button
            className="mt-4"
            onClick={handleUpdate}
            disabled={saving || !form.name.trim() || !form.email.trim()}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete my account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Type <strong>DELETE</strong> to
              confirm.
            </AlertDialogDescription>
            <Input
              placeholder="Type DELETE"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
            />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={confirmText !== "DELETE"}
              onClick={deleteAccount}
            >
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
