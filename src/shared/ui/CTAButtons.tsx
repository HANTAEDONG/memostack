"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/shadcn/button";
import { PenTool, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

export default function CTAButtons() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    // 세션 쿠키 존재로 간단 판별 (NextAuth 기본 세션 쿠키 키는 next-auth.session-token / __Secure-next-auth.session-token)
    const hasSessionCookie =
      document.cookie.includes("next-auth.session-token") ||
      document.cookie.includes("__Secure-next-auth.session-token");
    setIsAuth(hasSessionCookie);
  }, []);

  if (isAuth === false) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex justify-center"
      >
        <Link href="/api/auth/signin?callbackUrl=/dashboard">
          <Button size="lg" className="px-8 py-3 text-lg">
            로그인하고 시작하기
          </Button>
        </Link>
      </motion.div>
    );
  }

  if (isAuth === true) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0 }}
        >
          <Link href="/write">
            <Button size="lg" className="px-8 py-3 text-lg">
              <PenTool className="w-5 h-5 mr-2" />글 작성하기
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
        >
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              <BookOpen className="w-5 h-5 mr-2" />
              메모 둘러보기
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // 초기 로딩 상태: 게스트용 CTA를 SSR로 바로 노출해 크롤러/SEO에 불리하지 않게 하고,
  // 클라이언트에서 인증 확인되면 곧바로 교체되도록 함
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex justify-center"
    >
      <Link href="/api/auth/signin?callbackUrl=/dashboard">
        <Button size="lg" className="px-8 py-3 text-lg">
          로그인하고 시작하기
        </Button>
      </Link>
    </motion.div>
  );
}
