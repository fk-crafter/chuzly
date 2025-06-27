"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyPageContent() {
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
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-md border">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm text-muted-foreground">
              Verifying your email...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
            <p className="text-lg font-semibold text-green-700">
              Email verified!
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to login...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="w-10 h-10 text-red-600" />
            <p className="text-lg font-semibold text-red-600">
              Invalid or expired link.
            </p>
            <Button variant="outline" onClick={() => router.push("/lougiin")}>
              Go to login
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
