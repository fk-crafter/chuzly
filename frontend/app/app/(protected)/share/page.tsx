"use client";

import { Suspense } from "react";
import ShareEventPageContent from "./SharePageClientContent";

export default function ShareEventPage() {
  return (
    <Suspense
      fallback={<p className="text-center mt-20">Loading share page...</p>}
    >
      <ShareEventPageContent />
    </Suspense>
  );
}
