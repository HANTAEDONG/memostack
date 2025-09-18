"use client";

import { GoogleOAuthButton, usePopupAuth } from "@/entities/Auth";

export default function LoginWithGoogleCTA() {
  const { isPopupOpen, signInWithPopup } = usePopupAuth();
  return (
    <div className="max-w-xs mx-auto">
      <GoogleOAuthButton
        isPopupOpen={isPopupOpen}
        onSignIn={() => signInWithPopup({ provider: "google" })}
      />
    </div>
  );
}
