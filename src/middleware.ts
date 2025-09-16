import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/write") {
    if (!request.nextUrl.searchParams.has("id")) {
      return NextResponse.redirect(new URL("/api/posts/create", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/write",
};
