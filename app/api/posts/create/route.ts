import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const newPost = await prisma.post.create({
      data: {
        title: "",
        content: "",
        authorId: "cme9e3m7q00009w8chdkcmna8",
        status: "draft",
        category: "general",
      },
      select: {
        id: true,
      },
    });
    const writeUrl = new URL("/write", request.url);
    writeUrl.searchParams.set("id", newPost.id);

    return NextResponse.redirect(writeUrl);
  } catch {
    const errorUrl = new URL("/error", request.url);
    errorUrl.searchParams.set("message", "Post 생성에 실패했습니다");
    errorUrl.searchParams.set("code", "POST_CREATE_ERROR");
    return NextResponse.redirect(errorUrl);
  }
}
