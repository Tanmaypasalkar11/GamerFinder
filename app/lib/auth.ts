import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import type { Adapter } from "@auth/core/adapters";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";


// types/next-auth.d.ts

declare module "next-auth" {
  interface Session {
    user: {
      id: string ;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}


export const authOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token?.sub) { //abey idhar BT tha undefined aa raha tha isko optional karna tha bas hogaya ab sort
        session.user.id = token.sub;
      }
      console.log("Session callback:", session);
      return session;
    },
  }  
};

export const handlers = NextAuth(authOptions);

// Export individual functions for client-side use
export const { auth, signIn, signOut } = handlers;