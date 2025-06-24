"use client";

import { Suspense } from "react";
import VerifyPageContent from "./VerifyPageContent";

export default function VerifyPage() {
  return (
    <Suspense
      fallback={<p className="text-center mt-20">Loading verify page...</p>}
    >
      <VerifyPageContent />
    </Suspense>
  );
}
