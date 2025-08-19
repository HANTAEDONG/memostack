"use client";
import { useSession } from "next-auth/react";
import { Card } from "@/shared/ui/shadcn/Card";

export function AuthCheck() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Card className="p-6 m-4">
        <h2 className="text-lg font-semibold mb-4">인증 상태 확인</h2>
        <p>로딩 중...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 m-4">
      <h2 className="text-lg font-semibold mb-4">인증 상태 확인</h2>

      {session ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-green-700 font-medium">로그인됨</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p>
              <strong>이름:</strong> {session.user?.name || "없음"}
            </p>
            <p>
              <strong>이메일:</strong> {session.user?.email || "없음"}
            </p>
            <p>
              <strong>사용자 ID:</strong> {session.user?.id || "없음"}
            </p>
            <p>
              <strong>프로필 이미지:</strong>{" "}
              {session.user?.image ? "있음" : "없음"}
            </p>
          </div>

          <div className="text-sm text-gray-600">
            <p>✅ NextAuth와 Supabase가 성공적으로 연동되었습니다!</p>
            <p>이제 메모 작성, 수정, 삭제 기능을 사용할 수 있습니다.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-red-700 font-medium">로그인 필요</span>
          </div>

          <div className="text-sm text-gray-600">
            <p>사이드바 하단의 로그인 버튼을 클릭하여 로그인하세요.</p>
            <p>GitHub 또는 Google 계정으로 로그인할 수 있습니다.</p>
          </div>
        </div>
      )}
    </Card>
  );
}
