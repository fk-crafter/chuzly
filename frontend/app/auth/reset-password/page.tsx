"use client";

import { Suspense } from "react";
import ResetPasswordContent from "./ResetPasswordContent";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center mt-20">Loading reset password page...</p>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
