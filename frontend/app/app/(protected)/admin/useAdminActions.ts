"use client";

export function useAdminActions() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function updatePlan(userId: string, plan: "TRIAL" | "FREE" | "PRO") {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/plan`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      }
    );

    if (!res.ok) throw new Error("Plan update failed");
    return res.json();
  }

  async function updateRole(userId: string, to: "Admin" | "User") {
    const endpoint = to === "Admin" ? `/promote` : `/demote`;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}${endpoint}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) throw new Error("Role update failed");
    return res.json();
  }

  async function deleteUser(userId: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) throw new Error("Delete failed");
    return true;
  }

  return { updatePlan, updateRole, deleteUser };
}
