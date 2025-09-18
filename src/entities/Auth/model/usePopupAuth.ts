"use client";

import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { PopupAuthOptions, PopupAuthState } from "../lib/auth.types";

export function usePopupAuth(): PopupAuthState {
  const { data: session, update } = useSession();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openPopup = useCallback(
    (url: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const popup = window.open(
          url,
          "auth-popup",
          "width=500,height=600,scrollbars=yes,resizable=yes"
        );

        if (!popup) {
          alert("팝업이 차단되었습니다. 팝업 차단을 해제해주세요.");
          resolve(false);
          return;
        }

        setIsPopupOpen(true);

        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            setIsPopupOpen(false);
            setIsLoading(false);

            resolve(false);
          }
        }, 1000);

        // 팝업에서 메시지 수신
        const messageHandler = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;

          if (event.data.type === "AUTH_SUCCESS") {
            clearInterval(checkClosed);
            setIsPopupOpen(false);
            setIsLoading(false);
            // 세션 업데이트 후 새로고침으로 상태 확실히 초기화
            update().then(() => {
              setTimeout(() => {
                window.location.reload();
              }, 500); // 잠시 대기 후 새로고침
            });
            resolve(true);
            // 팝업은 콜백 페이지에서 자동으로 닫힘
          } else if (event.data.type === "AUTH_ERROR") {
            clearInterval(checkClosed);
            setIsPopupOpen(false);
            setIsLoading(false);
            console.error("인증 오류:", event.data.error);
            // 인증 실패 시에도 새로고침으로 상태 초기화
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            resolve(false);
            // 팝업은 콜백 페이지에서 자동으로 닫힘
          }
        };

        window.addEventListener("message", messageHandler);

        // 팝업이 닫힐 때 이벤트 리스너 제거
        const cleanup = () => {
          window.removeEventListener("message", messageHandler);
          clearInterval(checkClosed);
        };

        popup.addEventListener("beforeunload", cleanup);
      });
    },
    [update]
  );

  const signInWithPopup = useCallback(
    async (options: PopupAuthOptions = {}) => {
      const { provider = "google", callbackUrl } = options;

      setIsLoading(true);

      try {
        const result = await signIn(provider, {
          redirect: false,
          callbackUrl: callbackUrl || "/auth/callback",
        });

        if (result?.url) {
          const success = await openPopup(result.url);
          return success;
        }

        return false;
      } catch (error) {
        console.error("팝업 로그인 오류:", error);
        setIsLoading(false);
        return false;
      }
    },
    [openPopup]
  );

  const signOutWithPopup = useCallback(async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      // 로그아웃 후 새로고침으로 상태 초기화
      window.location.reload();
    } catch (error) {
      console.error("로그아웃 오류:", error);
      // 에러가 발생해도 새로고침으로 상태 초기화
      window.location.reload();
    }
  }, []);

  return {
    session,
    isLoading: isLoading,
    isPopupOpen,
    user: session?.user || null,
    isAuthenticated: !!session?.user,
    signInWithPopup,
    signOutWithPopup,
  };
}
