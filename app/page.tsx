import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/30 p-4">
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">BloomOps</h1>
        <p className="text-muted-foreground">
          Florist inventory management system
        </p>
        <Link href="/login">
          <Button>Sign in</Button>
        </Link>
      </div>
    </div>
  );
}
