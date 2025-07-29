"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>로딩 중...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span>안녕하세요, {session.user.name}님!</span>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => signIn("github")}
        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
      >
        GitHub로 로그인
      </button>
      <button
        onClick={() => signIn("google")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Google로 로그인
      </button>
    </div>
  );
}
