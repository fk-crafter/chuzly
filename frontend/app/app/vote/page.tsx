import { Suspense } from "react";
import { VotePageClient } from "@/components/VotePageClient";

export default function VotePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VotePageClient />
    </Suspense>
  );
}
