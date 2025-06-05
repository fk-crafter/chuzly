"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaApple } from "react-icons/fa";
import { ArrowLeft, Eye, EyeOff, Info, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";

const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .regex(/[A-Z]/, "At least one uppercase letter")
      .regex(/[a-z]/, "At least one lowercase letter")
      .regex(/[0-9]/, "At least one number")
      .regex(/[@#%&*!]/, "At least one special character (@, #, %, &, *, !)"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function CreateAccountModal() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTooltipConfirm, setShowTooltipConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
    match: false,
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: async (data) => {
      try {
        const validatedData = await registerSchema.parseAsync(data);
        return {
          values: validatedData,
          errors: {},
        };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            values: {},
            errors: error.formErrors.fieldErrors,
          };
        }
        return {
          values: {},
          errors: {},
        };
      }
    },
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const validatePassword = (password: string, confirm: string) => {
    setCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[@#%&*!]/.test(password),
      match: password === confirm,
    });
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
          }),
        }
      );

      if (!res.ok) throw new Error("Registration failed");
      const response = await res.json();

      localStorage.setItem("token", response.token);
      localStorage.setItem("userName", response.name);
      localStorage.setItem("userPlan", response.plan);

      window.location.href = "/login";
    } catch (err) {
      alert("Error during registration");
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 text-left pt-4"
      >
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" {...register("name")} placeholder="John Doe" />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="relative">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            onChange={(e) =>
              validatePassword(e.target.value, getValues("confirmPassword"))
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-[38px] text-gray-500"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
          <div
            className="absolute right-8 top-[42px] text-gray-500 cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info size={16} />
          </div>

          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute right-0 top-[72px] bg-white dark:bg-zinc-800 border p-3 rounded shadow-md w-64 text-sm z-50"
              >
                {[
                  ["length", "At least 8 characters"],
                  ["uppercase", "At least one uppercase letter"],
                  ["number", "At least one number"],
                  ["specialChar", "At least one special character"],
                ].map(([key, label]) => (
                  <p
                    key={key}
                    className={`flex items-center gap-2 ${
                      criteria[key as keyof typeof criteria]
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {criteria[key as keyof typeof criteria] ? (
                      <Check size={16} />
                    ) : (
                      <X size={16} />
                    )}{" "}
                    {label}
                  </p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="relative">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            onChange={(e) =>
              validatePassword(getValues("password"), e.target.value)
            }
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-2 top-[38px] text-gray-500"
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>

          <div
            className="absolute right-8 top-[42px] text-gray-500 cursor-pointer"
            onMouseEnter={() => setShowTooltipConfirm(true)}
            onMouseLeave={() => setShowTooltipConfirm(false)}
          >
            <Info size={16} />
          </div>

          <AnimatePresence>
            {showTooltipConfirm && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute right-0 top-[72px] bg-white dark:bg-zinc-800 border p-3 rounded shadow-md w-64 text-sm z-50"
              >
                <p
                  className={`flex items-center gap-2 ${
                    criteria.match ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {criteria.match ? <Check size={16} /> : <X size={16} />}{" "}
                  Passwords match
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !Object.values(criteria).every(Boolean)}
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
