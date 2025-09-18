"use client";

import { useSession } from "next-auth/react";
import { usePopupAuth } from "../model/usePopupAuth";
import { AuthLoadingButton } from "./AuthLoadingButton";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { LoginButton } from "./LoginButton";

export function AuthButton() {
  const { status } = useSession();
  const { session, isLoading, isPopupOpen, signInWithPopup, signOutWithPopup } =
    usePopupAuth();

  // 초기 세션 로딩 또는 인증 프로세스 로딩
  if (status === "loading" || isLoading) {
    return <AuthLoadingButton />;
  }

  if (!session) {
    return (
      <LoginButton
        isPopupOpen={isPopupOpen}
        onSignIn={() => signInWithPopup({ provider: "google" })}
      />
    );
  }

  return (
    <UserProfileDropdown
      user={session.user}
      onSignOut={signOutWithPopup}
      isLoading={isLoading}
    />
  );
}
