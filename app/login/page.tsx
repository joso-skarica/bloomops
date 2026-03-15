import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm space-y-8 rounded-lg border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">BloomOps</h1>
          <p className="text-sm text-muted-foreground">
            Florist inventory management
          </p>
        </div>

        <form
          action={async (formData) => {
            "use server";
            await signIn("credentials", {
              email: formData.get("email") as string,
              password: formData.get("password") as string,
              redirectTo: "/dashboard",
            });
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Demo: admin@bloomops.com / admin123
        </p>

        <p className="text-center text-sm">
          <Link href="/" className="text-primary underline hover:no-underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
