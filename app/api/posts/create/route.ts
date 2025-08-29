import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/shared/lib/nextAuth";

export async function GET(request: NextRequest) {
  try {
    // 🔐 서버에서 현재 로그인한 사용자 확인
    const session = await auth();

    if (!session?.user?.id) {
      const loginUrl = new URL("/api/auth/signin", request.url);
      return NextResponse.redirect(loginUrl);
    }

    console.log("🔍 포스트 생성 요청:", {
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name,
    });

    const newPost = await prisma.post.create({
      data: {
        title: "",
        content: "",
        authorId: session.user.id, // ✅ 실제 로그인한 사용자 ID 사용
        status: "draft",
        category: "general",
      },
      select: {
        id: true,
      },
    });
    const writeUrl = new URL("/write", request.url);
    writeUrl.searchParams.set("id", newPost.id);

    console.log("✅ 포스트 생성 성공:", {
      postId: newPost.id,
      authorId: session.user.id,
    });

    return NextResponse.redirect(writeUrl);
  } catch (error) {
    console.error("❌ 포스트 생성 실패:", error);

    const errorUrl = new URL("/error", request.url);
    errorUrl.searchParams.set("message", "Post 생성에 실패했습니다");
    errorUrl.searchParams.set("code", "POST_CREATE_ERROR");
    return NextResponse.redirect(errorUrl);
  }
}
