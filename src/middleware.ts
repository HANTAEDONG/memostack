export { auth as middleware } from "@/shared/lib/nextAuth";

export const config = {
  // 보호할 경로들을 여기에 정의
  matcher: [
    /*
     * 다음 경로들은 제외:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
