"use client";

import Toolbar from "./Toolbar";
import { EditorContent, useEditor } from "@tiptap/react";
import EditorOptions from "../model/EditorOptions";
import { useEffect, useState } from "react";

const Tiptap = () => {
  const editor = useEditor(EditorOptions);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  useEffect(() => {
    if (isDarkMode) {
      document.getElementById("tiptap-editor")?.classList.add("dark");
    } else {
      document.getElementById("tiptap-editor")?.classList.remove("dark");
    }
  }, [isDarkMode]);
  return (
    <div
      className="relative border border-gray-200 rounded-lg flex flex-col bg-white dark:bg-[oklch(14.5%_0_0)] w-[723px] max-md:w-full"
      id="tiptap-editor"
    >
      {editor && (
        <Toolbar
          editor={editor}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
