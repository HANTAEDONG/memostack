"use client";

import { GoogleOAuthButton } from "@/shared/ui/auth/GoogleOAuthButton";
import { usePopupAuth } from "@/shared/hooks/usePopupAuth";

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
