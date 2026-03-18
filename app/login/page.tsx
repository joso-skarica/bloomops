"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm space-y-8 rounded-xl border bg-card p-8 shadow-lg">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Leaf className="size-6" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">BloomOps</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Florist inventory management
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@bloomops.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="space-y-2 text-center">
          <p className="text-xs text-muted-foreground">
            Demo: admin@bloomops.com / admin123
          </p>
          <p className="text-sm">
            <Link href="/" className="text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
