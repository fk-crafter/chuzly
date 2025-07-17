"use client";

import { useEffect } from "react";
import { registerSW } from "@/lib/register-sw";

export default function ClientWrapper() {
  useEffect(() => {
    registerSW();
  }, []);

  return null;
}
