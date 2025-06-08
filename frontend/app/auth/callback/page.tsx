"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);

      router.push("/app/create-event");
    } else {
      router.push("/login");
    }
  }, [router, searchParams]);

  return <p className="text-center mt-20">Processing login...</p>;
}
