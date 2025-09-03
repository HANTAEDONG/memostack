import { NextRequest, NextResponse } from "next/server";
import { PostService } from "@/entities/Post";
import { auth } from "@/shared/lib/nextAuth";
import { logger } from "@/shared/lib/Logger/logger";

// 드래프트 발행
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "로그인이 필요합니다" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const result = await PostService.publishDraft(id, session.user.id);

    if (!result.success) {
      return NextResponse.json(
        {
          message: result.error?.message ?? "드래프트 발행에 실패했습니다",
        },
        { status: result.error?.statusCode ?? 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    // 에러 로깅 (디버깅용)
    logger.error("드래프트 발행 중 예상치 못한 오류", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      userId: (await auth())?.user?.id,
    });

    return NextResponse.json(
      { message: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
