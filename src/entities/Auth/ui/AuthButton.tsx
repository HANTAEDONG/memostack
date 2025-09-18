"use client";

import { usePopupAuth } from "../model/usePopupAuth";
import { AuthLoadingButton } from "./AuthLoadingButton";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { LoginButton } from "./LoginButton";

export function AuthButton() {
  const {
    session,
    status,
    isLoading,
    isPopupOpen,
    signInWithPopup,
    signOutWithPopup,
  } = usePopupAuth();

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
    <UserProfileDropdown user={session.user} onSignOut={signOutWithPopup} />
  );
}
