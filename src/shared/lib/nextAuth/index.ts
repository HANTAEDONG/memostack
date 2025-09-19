import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { UserService } from "@/entities/User";
import { logger } from "../Logger/logger";

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
  trustHost: true,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user && account && profile) {
        try {
          const userResult = await UserService.findOrCreate({
            id: user.id!,
            email: user.email!,
            name: user.name,
            image: user.image,
          });

          if (userResult.success) {
            const dbUser = userResult.data;
            // Google OAuth ID가 User.id가 되므로 동일함
            token.dbUserId = dbUser.id; // Google OAuth ID
            token.sub = dbUser.id; // Google OAuth ID
            logger.debug("사용자 DB 저장/업데이트 성공", {
              userId: dbUser.id,
              email: dbUser.email,
            });
          } else {
            logger.debug("사용자 DB 저장 실패", userResult.error);
            token.sub = user.id; // 실패해도 Google OAuth ID 사용
          }
        } catch (error) {
          logger.error("OAuth 사용자 처리 중 오류", error);
          token.sub = user.id; // 오류 발생해도 Google OAuth ID 사용
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
      if (url.includes("callbackUrl") || url.includes("auth-popup")) {
        console.log("팝업 로그인 감지, 콜백 페이지로 리다이렉트:", url);
        return `${baseUrl}/auth/callback`;
      }
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.AUTH_SECRET,
});
