"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/shared/ui/shadcn/button";
import Link from "next/link";

export function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error") ?? null;

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "서버 설정 오류가 발생했습니다. 관리자에게 문의하세요.";
      case "AccessDenied":
        return "접근이 거부되었습니다.";
      case "Verification":
        return "인증 토큰이 유효하지 않습니다.";
      case "OAuthSignin":
        return "OAuth 로그인 중 오류가 발생했습니다.";
      case "OAuthCallback":
        return "OAuth 콜백 처리 중 오류가 발생했습니다.";
      case "OAuthCreateAccount":
        return "계정 생성 중 오류가 발생했습니다.";
      case "EmailCreateAccount":
        return "이메일 계정 생성 중 오류가 발생했습니다.";
      case "Callback":
        return "콜백 처리 중 오류가 발생했습니다.";
      case "OAuthAccountNotLinked":
        return "이미 다른 방법으로 가입된 이메일입니다.";
      case "EmailSignin":
        return "이메일로 로그인 중 오류가 발생했습니다.";
      case "CredentialsSignin":
        return "로그인 정보가 올바르지 않습니다.";
      case "SessionRequired":
        return "로그인이 필요합니다.";
      default:
        return "알 수 없는 오류가 발생했습니다.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-red-600">로그인 오류</h1>
          <p className="text-gray-600">{getErrorMessage(error)}</p>
          {error && <p className="text-xs text-gray-400">오류 코드: {error}</p>}
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/dashboard">다시 로그인하기</Link>
          </Button>
        </div>

        <div className="text-xs text-gray-400">
          <p>문제가 지속되면 관리자에게 문의하세요.</p>
        </div>
      </div>
    </div>
  );
}
