"use client";

import { usePopupAuth } from "../model/usePopupAuth";
import { AuthLoadingButton } from "./AuthLoadingButton";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { LoginButton } from "./LoginButton";

export function AuthButton() {
  const { session, isLoading, isPopupOpen, signInWithPopup, signOutWithPopup } =
    usePopupAuth();

  if (isLoading) {
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
