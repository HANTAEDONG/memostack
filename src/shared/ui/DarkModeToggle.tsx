"use client";

import { Sun, Moon } from "lucide-react";
import useToggleDarkmode from "@/shared/hooks/useToggleDarkmode";
import { Button } from "@/shared/ui/shadcn/button";

interface DarkModeToggleProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost";
}

export default function DarkModeToggle({
  className = "",
  size = "default",
  variant = "ghost",
}: DarkModeToggleProps) {
  const { isDarkMode, mode, setTheme, isLoaded } = useToggleDarkmode();

  // hydration 완료 전에는 렌더링하지 않음 (SSR 불일치 방지)
  if (!isLoaded) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`${className} opacity-0`}
        disabled
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const cycle = (e?: React.MouseEvent<HTMLButtonElement>) => {
    // 옵션 없이 시스템으로 되돌리기: Shift(또는 Alt/Option) 클릭 시 'system'으로 리셋
    if (e && (e.shiftKey || e.altKey)) {
      setTheme("system");
      return;
    }
    // 시스템 옵션 제거: system 상태에서 클릭 시 명시 모드로 고정
    if (mode === "system") {
      setTheme(isDarkMode ? "light" : "dark");
      return;
    }
    setTheme(mode === "dark" ? "light" : "dark");
  };

  const icon = isDarkMode ? (
    <Sun className="h-4 w-4" />
  ) : (
    <Moon className="h-4 w-4" />
  );

  const label = isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환";

  return (
    <Button
      variant={variant}
      size={size}
      onClick={cycle}
      className={className}
      aria-label={label}
      title="클릭: 라이트/다크 전환 · Shift/Alt+클릭: 시스템 따르기"
    >
      {icon}
    </Button>
  );
}
