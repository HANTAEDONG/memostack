import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/lib/nextAuth";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/write") {
    const postId = request.nextUrl.searchParams.get("id");

    if (!postId) {
      return NextResponse.next();
    }

    try {
      const session = await auth();

      if (!session?.user?.id) {
        return NextResponse.redirect(new URL("/api/auth/signin", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Middleware permission check error:", error);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/write",
};
