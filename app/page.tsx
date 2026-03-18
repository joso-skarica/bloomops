import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 p-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
          <Leaf className="size-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">BloomOps</h1>
          <p className="mt-2 text-muted-foreground">
            Florist inventory management system
          </p>
        </div>
        <Link href="/login">
          <Button size="lg">Sign in</Button>
        </Link>
      </div>
    </div>
  );
}
