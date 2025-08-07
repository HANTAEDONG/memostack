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

  // 에디터 초기화 시 첫 번째 h1 요소에 포커스
  useEffect(() => {
    if (editor) {
      // 에디터가 준비되면 첫 번째 h1 요소로 커서 이동
      const firstHeading = editor.view.dom.querySelector("h1");
      if (firstHeading && !editor.state.doc.textContent.trim()) {
        editor.commands.focus("start");
      }
    }
  }, [editor]);

  return (
    <div
      className={cn(
        isDarkMode && "dark",
        "relative border border-gray-200 rounded-lg flex flex-col min-h-[calc(100vh-100px)]"
      )}
    >
      {editor && (
        <ToolbarComponent
          editor={editor}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}
      <EditorContent editor={editor} className="w-full h-full flex-1" />
    </div>
  );
};

export default Tiptap;
