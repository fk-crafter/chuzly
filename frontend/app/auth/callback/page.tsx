"use client";

import { Suspense } from "react";
import AuthCallbackContent from "./AuthCallbackContent";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={<p className="text-center mt-20">Processing login...</p>}
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
