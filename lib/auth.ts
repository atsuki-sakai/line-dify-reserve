
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

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {

          if(credentials.role === "admin") {
            const admin = await firestore.admin.getByEmail(credentials.email);
            return {
              id: admin?.id,
              email: admin?.email
            };
          }else{
            const salon = await firestore.salon.getByEmail(credentials.email);
            return {
              id: salon?.id,
              email: salon?.email
            };
          }
        } catch (error) {
          console.error("Middleware Auth error:", error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    jwt: async ({ token, user}) => {
      console.log("JWT callback:", { token, user });
      if (user?.email) {

        const salon = await firestore.salon.getByEmail(user.email);

        if (salon) {
          token.id = salon.id;
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      console.log("Session callback:", { session, token });
      if (session?.user) {
        session.user.id = token.id;
      }
      return session;
    },
    signIn: async ({ user }) => {
      console.log("SignIn callback:", { user });
      if (!user?.email) return false;
      return true;
    },
    redirect: async ({ baseUrl }) => {
      return `${baseUrl}/login`;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
};
