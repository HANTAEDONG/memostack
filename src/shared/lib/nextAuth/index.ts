import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { UserService } from "@/entities/User";
import { logger } from "@/shared/lib/error-handler";

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
      // 처음 로그인할 때 (OAuth 콜백에서)
      if (user && account && profile) {
        logger.info("새로운 OAuth 로그인", {
          email: user.email,
          provider: account.provider,
        });

        // 사용자 정보를 데이터베이스에 저장하거나 업데이트
        const result = await UserService.findOrCreate({
          email: user.email!,
          name: user.name,
          image: user.image,
        });

        if (result.success) {
          const dbUser = result.data;
          // 데이터베이스의 사용자 ID를 토큰에 저장
          token.dbUserId = dbUser.id;
          token.sub = dbUser.id;

          logger.info("사용자 DB 저장/업데이트 성공", {
            userId: dbUser.id,
            email: dbUser.email,
          });
        } else {
          logger.error("사용자 DB 저장 실패", result.error);
          // DB 저장에 실패해도 OAuth 로그인은 계속 진행
          // 하지만 user.id를 대신 사용
          token.sub = user.id;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // JWT 토큰에서 세션으로 사용자 ID 전달
      if (token?.dbUserId) {
        session.user.id = token.dbUserId as string;
      } else if (token?.sub) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // 로그인 후 리디렉션 처리
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.AUTH_SECRET,
});
