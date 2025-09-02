import { NextRequest, NextResponse } from "next/server";
import { PostService, DraftPostService } from "@/entities/Post";
import { auth } from "@/shared/lib/nextAuth";
import { PostSortField, SortOrder } from "@/entities/Post/lib/post.types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortBy = (searchParams.get("sortBy") as PostSortField) || "updatedAt";
    const sortOrder = (searchParams.get("sortOrder") as SortOrder) || "desc";
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;
    const result = await PostService.findAll({
      limit,
      offset,
      sortBy,
      sortOrder,
      filters: {
        category,
        status,
        search,
      },
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.error.message,
        },
        { status: result.error.statusCode }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      meta: {
        limit,
        offset,
        sortBy,
        sortOrder,
        filters: { category, status, search },
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "로그인이 필요합니다",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, category, status } = body;

    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "제목과 내용을 모두 입력해주세요",
        },
        { status: 400 }
      );
    }

    const result = await DraftPostService.createDraft({
      title,
      content,
      authorId: session.user.id,
      category: category || "general",
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.error.message,
        },
        { status: result.error.statusCode }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다",
      },
      { status: 500 }
    );
  }
}
