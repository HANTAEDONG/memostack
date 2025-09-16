import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Provider from "@/shared/layout/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "MemoStack",
  description: "메모 스택 애플리케이션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Critical CSS 인라인 - 렌더링 차단 방지 */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .write-page-container {
              width: 100%;
              height: 100%;
              min-height: 100vh;
              padding: 1rem;
              background-color: white;
              transition: background-color 0.2s ease;
            }
            @media (max-width: 640px) {
              .write-page-container { padding: 0; }
            }
            @media (prefers-color-scheme: dark) {
              .write-page-container { background-color: #0a0a0a; }
            }
            .dark .write-page-container {
              background-color: #0a0a0a;
            }
            /* 다크모드 전환 애니메이션 */
            * {
              transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
            }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
