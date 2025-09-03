import { NextRequest, NextResponse } from "next/server";
import { PostService } from "@/entities/Post";
import { auth } from "@/shared/lib/nextAuth";
import { logger } from "@/shared/lib/Logger/logger";
import { PostSortField, SortOrder } from "@/entities/Post/lib/post.types";

// 게시물 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortBy = (searchParams.get("sortBy") as PostSortField) || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") as SortOrder) || "desc";
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const authorId = searchParams.get("authorId");
    const search = searchParams.get("search");

    const options = {
      limit,
      offset,
      sortBy,
      sortOrder,
      filters: {
        ...(category && { category }),
        ...(status && { status }),
        ...(authorId && { authorId }),
        ...(search && { search }),
      },
    };

    const result = await PostService.findAll(options);

    if (!result.success) {
      return NextResponse.json(
        {
          message: result.error?.message ?? "게시물 목록 조회에 실패했습니다",
        },
        { status: result.error?.statusCode ?? 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    // 에러 로깅 (디버깅용)
    logger.error("게시물 목록 조회 중 예상치 못한 오류", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { message: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// 게시물 생성 (드래프트로 생성)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "로그인이 필요합니다" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, category } = body;

    const result = await PostService.createDraft({
      title,
      content,
      category,
      authorId: session.user.id,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          message: result.error?.message ?? "게시물 생성에 실패했습니다",
        },
        { status: result.error?.statusCode ?? 400 }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    // 에러 로깅 (디버깅용)
    logger.error("게시물 생성 중 예상치 못한 오류", {
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
