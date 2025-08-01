"use client";

import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Toolbar from "./Toolbar";
import { EditorContent, useEditor } from "@tiptap/react";

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit, Highlight],
    immediatelyRender: false,
    autofocus: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      editor.view.updateState(editor.view.state);
    },
    onSelectionUpdate: ({ editor }) => {
      editor.view.updateState(editor.view.state);
    },
  });

  return (
    <div className="bg-blue-300 dark:bg-[rgb(14, 14, 17)] rounded-lg flex flex-col px-2">
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
