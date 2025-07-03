"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Header() {
  const handleUnavailable = () => {
    toast("Not available yet", {
      description: "Sign up and login will be available at launch.",
    });
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b backdrop-blur-sm bg-white top-0 z-50">
      <Link href="/" className="flex items-center">
        <Image
          src="/logo3.png"
          alt="Chuzly Logo"
          width={50}
          height={50}
          priority
        />
      </Link>

      <div className="flex items-center gap-3">
        <button onClick={handleUnavailable} className="text-sm hover:underline">
          Login
        </button>
        <Button size="sm" onClick={handleUnavailable}>
          Sign up
        </Button>
      </div>
    </header>
  );
}
