"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      if (
        !pathname.startsWith("/login") &&
        !pathname.startsWith("/auth") &&
        !pathname.startsWith("/app/onboarding")
      ) {
        router.replace("/login");
      }
      return;
    }

    // Si déjà dans auth ou onboarding, on ne fait rien
    if (
      pathname.startsWith("/auth") ||
      pathname.startsWith("/app/onboarding")
    ) {
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Invalid token");
        }
        return res.json();
      })
      .then((user) => {
        if (user?.hasOnboarded) {
          router.replace("/app/create-event");
        } else {
          router.replace("/app/onboarding");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.replace("/login");
      });
  }, [pathname, router]);

  return <>{children}</>;
}
