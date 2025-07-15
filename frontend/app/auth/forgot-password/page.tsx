"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { CheckCircle, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) throw new Error("Error sending reset email");

      setSent(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full px-4 py-16 md:py-24 flex justify-center">
      <div className="w-full max-w-xs md:max-w-md bg-white dark:bg-zinc-900 border border-border rounded-lg shadow-lg p-6 md:p-10">
        <h1 className="text-xl md:text-2xl font-semibold mb-4 text-center">
          Reset your password
        </h1>

        {sent ? (
          <div className="flex flex-col items-center space-y-4 text-center">
            <CheckCircle className="w-14 h-14 md:w-16 md:h-16 text-green-500" />
            <p className="text-green-600 font-medium text-sm md:text-base">
              We’ve sent you a reset link! <br className="hidden md:block" />
              Check your inbox and follow the instructions to update your
              password.
            </p>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <Label htmlFor="email" className="text-sm md:text-base">
                  Your email
                </Label>
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="py-2 md:py-3"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-2 md:py-3"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
