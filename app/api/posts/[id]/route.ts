import { NextRequest, NextResponse } from "next/server";
import { PostService } from "@/entities/Post";
import { auth } from "@/shared/lib/nextAuth";
import { logger } from "@/shared/lib/Logger/logger";

// 게시물 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await PostService.findById(id);

    if (!result.success) {
      return NextResponse.json(
        {
          message: result.error?.message ?? "게시물을 찾을 수 없습니다",
        },
        { status: result.error?.statusCode ?? 404 }
      );
    }

    if (!result.data) {
      return NextResponse.json(
        { message: "게시물을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    // 에러 로깅 (디버깅용)
    logger.error("게시물 조회 중 예상치 못한 오류", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { message: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// 게시물 업데이트
export async function PUT(
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
    const body = await request.json();
    const { title, content, category, status } = body;

    const result = await PostService.update(
      id,
      { title, content, category, status },
      session.user.id
    );

    if (!result.success) {
      return NextResponse.json(
        {
          message: result.error?.message ?? "게시물 업데이트에 실패했습니다",
        },
        { status: result.error?.statusCode ?? 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    // 에러 로깅 (디버깅용)
    logger.error("게시물 업데이트 중 예상치 못한 오류", {
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
