"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import EditorOptions from "../lib/EditorOptions";
import ToolbarComponent from "./ToolbarComponent";
import useToggleDarkmode from "@/shared/hooks/useToggleDarkmode";
import { useEffect } from "react";
import { Input } from "@/shared/ui/shadcn/input";

interface TiptapProps {
  setContent: (content: string) => void;
  setTitle: (title: string) => void;
}

const Tiptap = ({ setContent, setTitle }: TiptapProps) => {
  const editor = useEditor({
    ...EditorOptions,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });
  const { isDarkMode, toggleDarkMode } = useToggleDarkmode();
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
    <div className="relative border border-gray-200 rounded-lg flex flex-col min-h-[calc(100vh-200px)]">
      {editor && (
        <ToolbarComponent
          editor={editor}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}
      <div className="w-full h-14 pt-4 px-4 focus:outline-none">
        <Input
          name="title"
          id="title"
          placeholder="제목"
          className="w-full border-none focus:outline-none h-10 px-0 py-0 font-bold placeholder:text-gray-400 [&]:text-3xl"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <EditorContent
        id="editor"
        editor={editor}
        className="w-full h-full flex-1 p-0 focus:outline-none"
      />
    </div>
  );
};

export default Tiptap;
