"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import EditorOptions from "../lib/EditorOptions";
import ToolbarComponent from "./ToolbarComponent";
import useToggleDarkmode from "@/shared/hooks/useToggleDarkmode";
import { Input } from "@/shared/ui/shadcn/input";
import { useEffect } from "react";

interface TiptapProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}

const Tiptap = ({
  title,
  content,
  onTitleChange,
  onContentChange,
}: TiptapProps) => {
  const editor = useEditor({
    ...EditorOptions,
    content: content,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      onContentChange(newContent);
    },
  });

  // content prop이 변경될 때 에디터 내용 업데이트
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const { isDarkMode, setTheme } = useToggleDarkmode();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    onTitleChange(newTitle);
  };

  return (
    <div className="relative border border-gray-200 rounded-lg flex flex-col min-h-[calc(100vh-200px)] sm:min-h-[calc(100vh-200px)]">
      {editor && (
        <ToolbarComponent
          editor={editor}
          isDarkMode={isDarkMode}
          setTheme={setTheme}
        />
      )}
      <div className="w-full h-14 pt-4 px-3 sm:px-5 focus:outline-none">
        <Input
          name="title"
          id="title"
          placeholder="제목"
          value={title}
          className="w-full border-none focus:outline-none h-10 px-0 py-0 font-bold placeholder:text-gray-400 text-xl sm:text-3xl"
          onChange={handleTitleChange}
        />
      </div>
      <EditorContent
        id="editor"
        editor={editor}
        className="w-full h-full flex-1 p-0 focus:outline-none [&_.ProseMirror]:min-h-[calc(100vh-300px)] [&_.ProseMirror]:p-3 sm:[&_.ProseMirror]:p-5"
      />
    </div>
  );
};

export default Tiptap;
