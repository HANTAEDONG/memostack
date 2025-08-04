import { useState } from "react";

const useToggleDarkmode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  return { isDarkMode, toggleDarkMode };
};

export default useToggleDarkmode;
