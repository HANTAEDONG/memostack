"use client";

import { Sun, Moon } from "lucide-react";
import useToggleDarkmode from "@/shared/hooks/useToggleDarkmode";
import { Button } from "@/shared/ui/shadcn/button";

interface DarkModeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export default function DarkModeToggle({
  className = "",
  size = "md",
  variant = "ghost",
}: DarkModeToggleProps) {
  const { isDarkMode, toggleDarkMode, isLoaded } = useToggleDarkmode();

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

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleDarkMode}
      className={className}
      aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}


