"use client";

import { GoogleOAuthButton } from "./GoogleOAuthButton";

interface LoginButtonProps {
  isPopupOpen: boolean;
  onSignIn: () => void;
}

export function LoginButton({ isPopupOpen, onSignIn }: LoginButtonProps) {
  return <GoogleOAuthButton isPopupOpen={isPopupOpen} onSignIn={onSignIn} />;
}
