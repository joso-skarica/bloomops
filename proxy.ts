import { auth } from "@/auth";

// Next.js 16: proxy.ts replaces middleware.ts
export { auth as proxy } from "@/auth";

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (auth routes)
     * - login (public)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, images
     */
    "/((?!api/auth|login|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
