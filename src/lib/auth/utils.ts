import { prisma } from "../prismadb";
import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  NextAuthOptions,
  User,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Adapter } from "next-auth/adapters";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
    emailVerified?: boolean;
    storeId?: string;
  }
  interface Session {
    user: User;
  }
}

export type AuthSession = {
  session: {
    user: User;
  } | null;
};

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified,
          storeId: "profile.id",
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        return true;
      } catch (error) {
        return false;
      }
    },
    async session({ session, user, token }) {
      try {
        if (token) {
          return {
            ...session,
            user: {
              ...session.user,
              id: token.id,
              randomKey: token.randomKey,
            },
          };
        }

        if (user.storeId === "profile.id") {
          const newStore = await prisma.store.create({
            data: {
              userEmail: user.email,
            },
          });

          await prisma.user.update({
            where: {
              email: user.email,
            },
            data: {
              storeId: newStore.id,
            },
          });

          return {
            ...session,
            user: {
              ...session.user,
              storeId: newStore.id,
            },
          };
        }

        return {
          ...session,
          user: {
            ...session.user,
            ...user,
          },
        };
      } catch (error) {
        return session;
      }
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      try {
        if (user) {
          const u = user as unknown as any;
          return {
            ...token,
            id: u.id,
            randomKey: u.randomKey,
          };
        }
        return token;
      } catch (error) {
        return token;
      }
    },
  },
};

export const Auth = async () => {
  const session = await getServerSession(authOptions);
  return { session } as AuthSession;
};
