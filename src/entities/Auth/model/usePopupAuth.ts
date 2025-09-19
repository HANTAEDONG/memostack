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

        // 팝업 상태 확인을 위한 여러 방법 사용
        let isPopupActive = true;

        const checkClosed = setInterval(() => {
          try {
            // 방법 1: window.closed 확인
            if (popup.closed) {
              isPopupActive = false;
              clearInterval(checkClosed);
              setIsPopupOpen(false);
              setIsLoading(false);
              resolve(false);
              return;
            }

            // 방법 2: 팝업 포커스 확인 (COOP가 적용되지 않은 경우)
            try {
              popup.focus();
            } catch (focusError) {
              // 포커스할 수 없으면 팝업이 닫혔거나 차단된 것으로 간주
              console.warn("팝업 포커스 실패:", focusError);
              isPopupActive = false;
              clearInterval(checkClosed);
              setIsPopupOpen(false);
              setIsLoading(false);
              resolve(false);
            }
          } catch (error) {
            // COOP 오류가 발생하면 팝업이 차단된 것으로 간주
            console.warn("팝업 상태 확인 중 COOP 오류:", error);
            isPopupActive = false;
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
            isPopupActive = false;
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
            isPopupActive = false;
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
      // 로그아웃 후 랜딩페이지로 리다이렉션
      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 오류:", error);
      // 에러가 발생해도 랜딩페이지로 리다이렉션
      window.location.href = "/";
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
