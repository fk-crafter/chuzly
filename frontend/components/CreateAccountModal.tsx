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
  .regex(/[A-Z]/, "1 uppercase")
  .regex(/[a-z]/, "1 lowercase")
  .regex(/[0-9]/, "1 number")
  .regex(/[^A-Za-z0-9]/, "1 special");

function Rule({ ok, text }: { ok: boolean; text: string }) {
  const Icon = ok ? CheckCircle : XCircle;
  return (
    <p
      className={`flex items-center text-sm ${
        ok ? "text-green-600" : "text-red-500"
      }`}
    >
      <Icon className="w-4 h-4 mr-2" /> {text}
    </p>
  );
}

export function CreateAccountModal() {
  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [valid, setValid] = useState({
    len: false,
    up: false,
    low: false,
    num: false,
    spec: false,
  });
  const [showP, setShowP] = useState(false);
  const [showC, setShowC] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const p = f.password;
    setValid({
      len: p.length >= 12,
      up: /[A-Z]/.test(p),
      low: /[a-z]/.test(p),
      num: /[0-9]/.test(p),
      spec: /[^A-Za-z0-9]/.test(p),
    });
  }, [f.password]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [e.target.name]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (f.password !== f.confirm) return alert("Passwords do not match");
    if (!Object.values(valid).every(Boolean))
      return alert("Password not strong enough");
    try {
      passwordSchema.parse(f.password);
    } catch (err: any) {
      return alert(err.message);
    }

    setSending(true);
    try {
      /* 1️⃣ registration */
      const r1 = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: f.email,
            password: f.password,
            name: f.name,
          }),
        }
      );
      if (!r1.ok) throw new Error(await r1.text());

      /* 2️⃣ magic-link */
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-magic-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: f.email }),
      });

      setSent(true);
      setF({ ...f, password: "", confirm: "" });
    } catch (err) {
      console.error(err);
      alert("Registration or email failed");
    } finally {
      setSending(false);
    }
  }

  const pwdMatch = f.password && f.confirm && f.password === f.confirm;

  return (
    <div className="relative z-10 max-w-sm w-full bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 pt-10 border">
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </Link>

      <h1 className="text-2xl font-semibold text-center">
        Create your account
      </h1>

      {/* OAuth buttons */}
      <div className="space-y-3 mt-5">
        <Link
          href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
          className="block"
        >
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            <FcGoogle className="text-xl" /> Continue with Google
          </Button>
        </Link>
        <Link
          href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github`}
          className="block"
        >
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            <FaGithub className="text-xl" /> Continue with GitHub
          </Button>
        </Link>
        <div className="relative">
          <Button
            variant="outline"
            disabled
            className="w-full flex items-center justify-center opacity-50"
          >
            <FaApple className="text-xl" /> Continue with Apple
          </Button>
          <span className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 bg-yellow-400 text-black px-2 py-0.5 rounded text-[10px] font-bold">
            COMING&nbsp;SOON
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4 mt-6 text-left">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="John Doe"
            value={f.name}
            onChange={onChange}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            value={f.email}
            onChange={onChange}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showP ? "text" : "password"}
              required
              value={f.password}
              onChange={onChange}
            />
            <button
              type="button"
              className="absolute right-2 top-2"
              onClick={() => setShowP(!showP)}
              tabIndex={-1}
            >
              {showP ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {/* rules */}
          <div className="relative group mt-1">
            <span className="flex items-center gap-1 text-xs cursor-pointer text-muted-foreground">
              <Info className="w-3 h-3" /> Password rules
            </span>
            <div className="absolute z-10 hidden group-hover:block bg-white dark:bg-zinc-800 border p-3 rounded-md mt-1 w-64 space-y-1">
              <Rule ok={valid.len} text="≥ 12 chars" />
              <Rule ok={valid.up} text="1 upper-case" />
              <Rule ok={valid.low} text="1 lower-case" />
              <Rule ok={valid.num} text="1 number" />
              <Rule ok={valid.spec} text="1 special char" />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="confirm">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirm"
              name="confirm"
              type={showC ? "text" : "password"}
              required
              value={f.confirm}
              onChange={onChange}
            />
            <button
              type="button"
              className="absolute right-2 top-2"
              onClick={() => setShowC(!showC)}
              tabIndex={-1}
            >
              {showC ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {f.confirm && (
            <p
              className={`flex items-center text-sm mt-1 ${
                pwdMatch ? "text-green-600" : "text-red-500"
              }`}
            >
              {pwdMatch ? (
                <CheckCircle className="w-4 h-4 mr-1" />
              ) : (
                <XCircle className="w-4 h-4 mr-1" />
              )}
              {pwdMatch ? "Password confirmed" : "Passwords do not match"}
            </p>
          )}
        </div>

        {sent && (
          <p className="text-sm text-center text-green-600">
            Magic-link sent to <span className="font-medium">{f.email}</span>.
            Check your inbox to activate your account.
          </p>
        )}

        <Button type="submit" className="w-full" disabled={sending}>
          {sending ? "Creating…" : "Create Account"}
        </Button>
      </form>

      <p className="text-sm text-center text-muted-foreground mt-4">
        Already have an account?{" "}
        <Link href="/lougiin" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
