"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    const fetchUser = async () => {
      if (!token) {
        router.push("/login");
        return;
      }

      localStorage.setItem("token", token);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data?.hasOnboarded) {
          router.push("/app/create-event");
        } else {
          router.push("/app/onboarding");
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        router.push("/login");
      }
    };

    fetchUser();
  }, [router, searchParams]);

  return null;
}
