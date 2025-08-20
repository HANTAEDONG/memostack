"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Card } from "@/shared/ui/shadcn/Card";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorMessage =
    searchParams?.get("message") || "알 수 없는 오류가 발생했습니다";
  const errorCode = searchParams?.get("code") || "UNKNOWN_ERROR";
  const handleGoHome = () => {
    router.push("/");
  };
  const handleRetry = () => {
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <Card className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          오류가 발생했습니다
        </h1>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        <div className="text-sm text-gray-500 mb-6">오류 코드: {errorCode}</div>
        <div className="flex gap-3">
          <button
            onClick={handleGoHome}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="h-4 w-4" />
            홈으로
          </button>
          <button
            onClick={handleRetry}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </button>
        </div>
      </Card>
    </div>
  );
}
