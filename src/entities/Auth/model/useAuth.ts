"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { AuthUser, AuthState } from "../lib/auth.types";

export const useAuth = (): AuthState => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      });
    } else {
      setUser(null);
    }

    setIsLoading(false);
  }, [session, status]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    session,
  };
};
