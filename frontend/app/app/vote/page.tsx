"use client";

import { Suspense } from "react";
import VotePageClientContent from "./VotePageClientContent";

export default function VotePage() {
  return (
    <Suspense
      fallback={<p className="text-center mt-20">Loading vote page...</p>}
    >
      <VotePageClientContent />
    </Suspense>
  );
}
