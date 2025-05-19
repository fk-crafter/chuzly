import { Suspense } from "react";
import { ShareEventPageClient } from "@/components/ShareEventPageClient";

export default function ShareEventPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShareEventPageClient />
    </Suspense>
  );
}
