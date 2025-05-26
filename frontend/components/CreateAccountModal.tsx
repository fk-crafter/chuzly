"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaApple } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

export function CreateAccountModal() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
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

      <div className="text-2xl font-semibold">Create your account</div>

      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 justify-center"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="w-full flex items-center gap-2 justify-center"
        >
          <FaGithub className="text-xl" />
          Continue with GitHub
        </Button>

        <Button
          variant="outline"
          className="w-full flex items-center gap-2 justify-center"
        >
          <FaApple className="text-xl" />
          Continue with Apple
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left pt-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

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
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>
    </div>
  );
}
