import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { UserService } from "@/entities/User";
import { logger } from "../Logger/logger";
import { ErrorHandler, AppError } from "@/shared/lib/Error/error-handler";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface JWT {
    sub: string;
    dbUserId?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user && account && profile) {
        logger.debug("새로운 OAuth 로그인", {
          email: user.email,
          provider: account.provider,
        });
        const result = await ErrorHandler.safeAsync(async () => {
          const userResult = await UserService.findOrCreate({
            email: user.email!,
            name: user.name,
            image: user.image,
          });
          if (!userResult.success) {
            throw new AppError(
              userResult.error.message,
              userResult.error.type,
              userResult.error.code,
              userResult.error.statusCode
            );
          }
          return userResult.data;
        }, "OAuth 사용자 처리");
        if (result.success) {
          const dbUser = result.data;
          token.dbUserId = dbUser.id;
          token.sub = dbUser.id;
          logger.debug("사용자 DB 저장/업데이트 성공", {
            userId: dbUser.id,
            email: dbUser.email,
          });
        } else {
          logger.debug("사용자 DB 저장 실패", result.error);
          token.sub = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.dbUserId) {
        session.user.id = token.dbUserId as string;
      } else if (token?.sub) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.AUTH_SECRET,
});
