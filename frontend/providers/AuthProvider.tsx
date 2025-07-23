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
      if (!pathname.startsWith("/login") && !pathname.startsWith("/auth")) {
        router.replace("/login");
      }
      return;
    }

    if (
      !pathname.startsWith("/app/create-event") &&
      !pathname.startsWith("/app/onboarding") &&
      !pathname.startsWith("/login")
    ) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
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
    }
  }, [pathname, router]);

  return <>{children}</>;
}
