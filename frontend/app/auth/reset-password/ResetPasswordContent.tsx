"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle, XCircle, Info } from "lucide-react";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(12, "Minimum 12 characters")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[a-z]/, "At least one lowercase letter")
  .regex(/[0-9]/, "At least one number")
  .regex(/[^A-Za-z0-9]/, "At least one special character");

function PasswordRule({ valid, text }: { valid: boolean; text: string }) {
  const Icon = valid ? CheckCircle : XCircle;
  return (
    <div
      className={`flex items-center text-xs md:text-sm ${
        valid ? "text-green-600" : "text-red-500"
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {text}
    </div>
  );
}

export default function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showMobileRules, setShowMobileRules] = useState(false);

  const [rules, setRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setRules({
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("The passwords do not match");
      return;
    }

    try {
      passwordSchema.parse(password);
    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? "Invalid password");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword: password }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch {
      setError("Request failed");
    }
  };

  if (!token)
    return <p className="text-center mt-10 text-red-500">Missing token</p>;

  return (
    <main className="w-full px-4 py-16 md:py-24 flex justify-center">
      <div className="w-full max-w-xs md:max-w-md bg-white dark:bg-zinc-900 border border-border rounded-lg shadow-lg p-5 md:p-8">
        <h1 className="text-xl md:text-2xl font-semibold mb-6 text-center">
          Reset your password
        </h1>

        {success ? (
          <div className="flex flex-col items-center text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <p className="text-green-600 font-medium">
              Password successfully updated!
            </p>
            <p className="text-muted-foreground text-sm">
              You’ll be redirected to login shortly...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-2"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="relative mt-1">
                <button
                  type="button"
                  className="flex md:hidden items-center gap-2 text-muted-foreground text-xs"
                  onClick={() => setShowMobileRules((prev) => !prev)}
                >
                  <Info className="w-4 h-4" />
                  Password rules
                </button>

                {showMobileRules && (
                  <div className="bg-white dark:bg-zinc-800 p-2 rounded-md shadow-md mt-1 border space-y-1 w-52">
                    <PasswordRule
                      valid={rules.length}
                      text="Minimum 12 characters"
                    />
                    <PasswordRule
                      valid={rules.uppercase}
                      text="At least one uppercase letter"
                    />
                    <PasswordRule
                      valid={rules.lowercase}
                      text="At least one lowercase letter"
                    />
                    <PasswordRule
                      valid={rules.number}
                      text="At least one number"
                    />
                    <PasswordRule
                      valid={rules.special}
                      text="At least one special character"
                    />
                  </div>
                )}

                <div className="hidden md:block group relative mt-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm cursor-default">
                    <Info className="w-4 h-4" />
                    Password rules
                  </div>
                  <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-white dark:bg-zinc-800 p-3 rounded-md shadow-md border space-y-1 w-64 z-50">
                    <PasswordRule
                      valid={rules.length}
                      text="Minimum 12 characters"
                    />
                    <PasswordRule
                      valid={rules.uppercase}
                      text="At least one uppercase letter"
                    />
                    <PasswordRule
                      valid={rules.lowercase}
                      text="At least one lowercase letter"
                    />
                    <PasswordRule
                      valid={rules.number}
                      text="At least one number"
                    />
                    <PasswordRule
                      valid={rules.special}
                      text="At least one special character"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="confirm">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-2"
                  onClick={() => setShowConfirm((p) => !p)}
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
