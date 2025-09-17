import { useState, useEffect } from "react";

type ThemeMode = "light" | "dark" | "system";

const useToggleDarkmode = () => {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 초기 로드 시 localStorage에서 다크모드 상태 읽기
  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("theme") as ThemeMode | null) || "system";
    setMode(savedTheme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = (m: ThemeMode) => {
      const useDark = m === "dark" || (m === "system" && media.matches);
      setIsDarkMode(useDark);
      if (useDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    apply(savedTheme);

    const handleChange = () => {
      const current =
        (localStorage.getItem("theme") as ThemeMode | null) || "system";
      if (current === "system") apply("system");
    };

    media.addEventListener?.("change", handleChange);
    media.addListener?.(handleChange);

    setIsLoaded(true);

    return () => {
      media.removeEventListener?.("change", handleChange);
      media.removeListener?.(handleChange);
    };
  }, []);

  const setTheme = (next: ThemeMode) => {
    setMode(next);
    localStorage.setItem("theme", next);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const useDark = next === "dark" || (next === "system" && media.matches);
    setIsDarkMode(useDark);
    if (useDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return { isDarkMode, mode, setTheme, isLoaded };
};

export default useToggleDarkmode;
