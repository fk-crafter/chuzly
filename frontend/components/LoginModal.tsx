"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaApple } from "react-icons/fa";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { ShineBorder } from "@/components/magicui/shine-border";
import Image from "next/image";

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

      window.location.href = "/app/dashboard";
    } catch (err) {
      console.error(err);
      alert("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xs md:max-w-sm mx-auto">
      <div className="hidden md:block relative z-10 bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 pt-10 text-center space-y-6 border border-border">
        <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />

        <Link
          href="/"
          className="absolute top-3 left-3 flex items-center text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Link>

        <div className="text-2xl font-semibold">Welcome to Chuzly</div>

        <div className="space-y-4">
          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
            className="block"
          >
            <Button
              variant="outline"
              className="w-full flex items-center justify-center py-3 text-base"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </Button>
          </Link>
          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github`}
            className="block"
          >
            <Button
              variant="outline"
              className="w-full flex items-center justify-center py-3 text-base"
            >
              <FaGithub className="text-xl" />
              Continue with GitHub
            </Button>
          </Link>
          <div className="relative w-full">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center opacity-50 cursor-not-allowed py-3 text-base"
              disabled
            >
              <FaApple className="text-xl" />
              Continue with Apple
            </Button>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow pointer-events-none">
              COMING SOON
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4 text-left">
          <div>
            <Label htmlFor="email" className="pb-1 text-base">
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
              className="py-3"
            />
          </div>

          <div className="relative">
            <Label htmlFor="password" className="pb-1 text-base">
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
                className="py-3"
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
              <div className="flex items-center justify-between text-sm pt-2">
                <span />
                <Link
                  href="/auth/forgot-password"
                  className="text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-base"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          Don’t have an account?{" "}
          <Link href="/create-account" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {/* Mobile Version */}
      <div className="block md:hidden min-h-screen px-4 pt-16 pb-8 bg-white dark:bg-zinc-900">
        <div className="max-w-md mx-auto space-y-6">
          <Link
            href="/welcome"
            className="absolute top-4 left-4 flex items-center text-xs text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Link>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-muted-foreground/20 flex items-center justify-center text-muted-foreground font-bold text-xl">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
            </div>
            <h1 className="text-lg font-semibold">Welcome back</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
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

              <div className="flex justify-end text-xs pt-1">
                <Link
                  href="/auth/forgot-password"
                  className="text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="flex items-center space-x-2 justify-center text-xs text-muted-foreground pt-2">
            <span>or</span>
          </div>

          <div className="space-y-2">
            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
              >
                <FcGoogle className="text-xl" />
                Continue with Google
              </Button>
            </Link>
            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github`}>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
              >
                <FaGithub className="text-xl" />
                Continue with GitHub
              </Button>
            </Link>
            <div className="relative">
              <Button
                variant="outline"
                className="w-full opacity-50 cursor-not-allowed"
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

          <p className="text-xs text-center text-muted-foreground">
            Don’t have an account?{" "}
            <Link
              href="/create-account"
              className="text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
