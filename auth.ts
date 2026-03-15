import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const nextAuth = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Demo credentials for scaffold - replace with proper auth later
        const DEMO_EMAIL = "admin@bloomops.com";
        const DEMO_PASSWORD = "admin123";

        if (
          credentials.email === DEMO_EMAIL &&
          credentials.password === DEMO_PASSWORD
        ) {
          return {
            id: "demo-user",
            email: DEMO_EMAIL,
            name: "Admin",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      // Public routes
      if (pathname === "/" || pathname.startsWith("/login")) return true;
      if (isLoggedIn) return true;

      return false; // Redirect unauthenticated users to login
    },
  },
});

export const { handlers, auth, signIn, signOut } = nextAuth;
