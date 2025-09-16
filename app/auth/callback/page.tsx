"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AuthCallbackPage() {
  const { data: session, status } = useSession();
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (messageSent) return;

    console.log("콜백 페이지 상태:", { status, session: !!session });

    if (session) {
      console.log("인증 성공, 메시지 전송 중...");
      window.opener?.postMessage(
        {
          type: "AUTH_SUCCESS",
          session: {
            user: session.user,
            expires: session.expires,
          },
        },
        window.location.origin
      );
      setMessageSent(true);

      // 메시지 전송 후 즉시 팝업 닫기
      setTimeout(() => {
        console.log("팝업 닫기 시도");
        window.close();
      }, 200);
    } else if (status === "unauthenticated") {
      console.log("인증 실패, 에러 메시지 전송 중...");
      window.opener?.postMessage(
        { type: "AUTH_ERROR", error: "인증에 실패했습니다." },
        window.location.origin
      );
      setMessageSent(true);

      setTimeout(() => {
        window.close();
      }, 200);
    }
  }, [session, status, messageSent]);

  // 페이지 로드 후 일정 시간이 지나면 자동으로 닫기 (안전장치)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!messageSent) {
        console.log("타임아웃으로 팝업 닫기");
        window.close();
      }
    }, 2000); // 10초 후 자동 닫기

    return () => clearTimeout(timer);
  }, [messageSent]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
        <p className="text-xs text-gray-400 mt-2">
          {status === "loading"
            ? "세션 확인 중..."
            : session
            ? "로그인 성공!"
            : "로그인 실패"}
        </p>
      </div>
    </div>
  );
}
