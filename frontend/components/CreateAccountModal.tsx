"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaApple } from "react-icons/fa";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Info,
} from "lucide-react";
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
      className={`flex items-center text-sm ${
        valid ? "text-green-600" : "text-red-500"
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {text}
    </div>
  );
}

export function CreateAccountModal() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch =
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  useEffect(() => {
    const value = formData.password;
    setPasswordValidations({
      length: value.length >= 12,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[^A-Za-z0-9]/.test(value),
    });
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!passwordsMatch) {
      alert("The passwords do not match.");
      return;
    }

    const allValid = Object.values(passwordValidations).every(Boolean);
    if (!allValid) {
      alert("The password does not meet all the rules.");
      return;
    }

    try {
      passwordSchema.parse(formData.password);
    } catch (err: any) {
      alert("Invalid password: " + (err.errors?.[0]?.message || "Error"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Registration failed.");
      }

      setSuccessMessage(
        "Account created! Please check your email to verify your address."
      );
    } catch (err) {
      console.error(err);
      alert("Error during registration. See the console.");
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

      <div className="text-2xl font-semibold">Create your account</div>

      {successMessage && (
        <div className="text-green-600 text-sm font-medium">
          ✅ {successMessage}
        </div>
      )}

      {/* Login Providers */}
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

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-left pt-4">
        {/* Name */}
        <div>
          <Label htmlFor="name" className="pb-2">
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="pb-2">
            Email
          </Label>
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

        {/* Password */}
        <div className="relative">
          <Label htmlFor="password" className="pb-2">
            Password
          </Label>
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

          <div className="relative group mt-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm cursor-pointer">
              <Info className="w-4 h-4" />
              Password rules
            </div>
            <div className="absolute z-10 hidden group-hover:block bg-white dark:bg-zinc-800 p-3 rounded-md shadow-md mt-2 border space-y-1 w-64">
              <PasswordRule
                valid={passwordValidations.length}
                text="Minimum 12 characters"
              />
              <PasswordRule
                valid={passwordValidations.uppercase}
                text="At least one uppercase letter"
              />
              <PasswordRule
                valid={passwordValidations.lowercase}
                text="At least one lowercase letter"
              />
              <PasswordRule
                valid={passwordValidations.number}
                text="At least one number"
              />
              <PasswordRule
                valid={passwordValidations.special}
                text="At least one special character"
              />
            </div>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Label htmlFor="confirmPassword" className="pb-2">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-2"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {formData.confirmPassword.length > 0 && (
            <div
              className={`flex items-center mt-1 text-sm ${
                passwordsMatch ? "text-green-600" : "text-red-500"
              }`}
            >
              {passwordsMatch ? (
                <CheckCircle className="w-4 h-4 mr-1" />
              ) : (
                <XCircle className="w-4 h-4 mr-1" />
              )}
              {passwordsMatch
                ? "Password confirmed"
                : "The passwords do not match"}
            </div>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/lougiin" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
