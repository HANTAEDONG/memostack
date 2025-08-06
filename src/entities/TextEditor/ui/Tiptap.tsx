"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import EditorOptions from "../lib/EditorOptions";
import ToolbarComponent from "./ToolbarComponent";
import { cn } from "@/shared/lib/cn";
import useToggleDarkmode from "@/shared/hooks/useToggleDarkmode";
import { useEffect } from "react";

interface TiptapProps {
  initialContent?: string;
  setContent: (content: string) => void;
}

const Tiptap = ({ initialContent, setContent }: TiptapProps) => {
  const editor = useEditor(EditorOptions);
  const { isDarkMode, toggleDarkMode } = useToggleDarkmode();
  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);
  useEffect(() => {
    if (editor) {
      editor.on("update", () => {
        setContent(editor.getHTML());
      });
    }
    return () => {
      editor?.off("update", () => {
        setContent(editor.getHTML());
      });
    };
  }, [editor, setContent]);
  return (
    <div
      className={cn(
        isDarkMode && "dark",
        "relative border border-gray-200 rounded-lg flex flex-col bg-white dark:bg-[oklch(14.5%_0_0)] w-[723px] max-md:w-full"
      )}
    >
      {editor && (
        <ToolbarComponent
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
