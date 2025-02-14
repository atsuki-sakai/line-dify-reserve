import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

import { firestore } from "@/services/firistore/firestore";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials: Record<"email" | "password" | "role", string> | undefined) {
        console.log("1. Starting authorize with credentials:", {
          email: credentials?.email,
          hasPassword: !!credentials?.password
        });

        if (!credentials?.email || !credentials?.password) {
          console.log("2. Missing credentials");
          return null;
        }

        try {
          console.log("3. Fetching user document from Firestore");
          const snapshot = await firestore
            .collection("users")
            .where("email", "==", credentials.email)
            .get();

          if (snapshot.empty) {
            console.log("5. No matching documents");
            return null;
          }

          const userDoc = snapshot.docs[0];
          const user = userDoc.data();

          console.log("6. Role check:", {
            requestedRole: credentials.role,
            userRole: user.role
          });

          const isAdminLogin = credentials.role === "admin";
          if (isAdminLogin && user.role !== "admin") {
            console.log("6.1 Admin login attempt with non-admin account");
            return null;
          }

          const isSalonLogin = credentials.role === "salon";
          if (isSalonLogin && user.role !== "salon") {
            console.log("6.2 Salon login attempt with non-salon account");
            return null;
          }

          console.log("6. User data:", {
            email: user?.email,
            role: user?.role,
            hasId: !!userDoc.id,
            rawUser: user
          });

          if (!user) {
            console.log("7. No user data");
            return null;
          }

          console.log("8. Returning user object");
          return {
            id: userDoc.id,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("9. Auth error:", error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      console.log("JWT callback:", { token, user });
      if (user?.email) {
        const snapshot = await firestore
          .collection("users")
          .where("email", "==", user.email)
          .get();

        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          const userData = userDoc.data();
          token.role = userData?.role;
          token.id = userDoc.id;
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      console.log("Session callback:", { session, token });
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
    signIn: async ({ user }) => {
      console.log("SignIn callback:", { user });
      if (!user?.email) return false;
      return true;
    },
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith("/admin")) {
        return `${baseUrl}/admin/login`;
      }
      return `${baseUrl}/auth/login`;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
};
