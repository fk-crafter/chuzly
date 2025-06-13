"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaApple } from "react-icons/fa";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export function LoginModal() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Login failed");
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userPlan", data.plan);

      window.location.href = "/app/create-event";
    } catch (err) {
      console.error(err);
      alert("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 max-w-sm w-full bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 pt-10 text-center space-y-4 border border-border">
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </Link>

      <div className="text-2xl font-semibold">Welcome to Event-app</div>

      <div className="space-y-4">
        <div>
          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
            className="w-full block"
          >
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </Button>
          </Link>
        </div>

        <div>
          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github`}
            className="w-full block"
          >
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              <FaGithub className="text-xl" />
              Continue with GitHub
            </Button>
          </Link>
        </div>

        <div className="relative w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center opacity-50 cursor-not-allowed relative"
            disabled
          >
            <FaApple className="text-xl" />
            Continue with Apple
          </Button>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow z-10 pointer-events-none">
            COMING SOON
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-6 text-left">
        <div>
          <Label htmlFor="email" className="pb-2">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="relative">
          <Label htmlFor="password" className="pb-2">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-2"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <p className="text-sm text-center text-muted-foreground">
        Don’t have an account?{" "}
        <Link href="/crrreate-account" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
