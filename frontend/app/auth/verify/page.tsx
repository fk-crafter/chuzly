"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setTimeout(() => router.push("/lougiin"), 3000);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [params, router]);

  return (
    <main className="max-w-xl mx-auto py-20 text-center">
      {status === "loading" && <p>Verifying your email...</p>}
      {status === "success" && (
        <p className="text-green-600 font-semibold">
          ✅ Email verified! Redirecting...
        </p>
      )}
      {status === "error" && (
        <p className="text-red-600 font-semibold">
          ❌ Invalid or expired link.
        </p>
      )}
    </main>
  );
}
