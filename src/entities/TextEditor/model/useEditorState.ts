import { useState, useCallback, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { EditorState } from "../model/editor.types";

export const useEditorState = (editor: Editor | null) => {
  const [editorState, setEditorState] = useState<EditorState>({
    activeMarks: {
      bold: false,
      italic: false,
      underline: false,
      strike: false,
      code: false,
      link: false,
      highlight: false,
    },
    activeNodes: {
      heading: null,
      codeBlock: false,
      blockquote: false,
      orderedList: false,
      bulletList: false,
      taskList: false,
      link: false,
      highlight: false,
    },
  });

  const updateStates = useCallback(() => {
    if (!editor) return;

    setEditorState({
      activeMarks: {
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        underline: editor.isActive("underline"),
        strike: editor.isActive("strike"),
        code: editor.isActive("code"),
        link: editor.isActive("link"),
        highlight: editor.isActive("highlight"),
      },
      activeNodes: {
        heading: editor.isActive("heading", { level: 1 })
          ? 1
          : editor.isActive("heading", { level: 2 })
          ? 2
          : editor.isActive("heading", { level: 3 })
          ? 3
          : null,
        codeBlock: editor.isActive("codeBlock"),
        blockquote: editor.isActive("blockquote"),
        orderedList: editor.isActive("orderedList"),
        bulletList: editor.isActive("bulletList"),
        taskList: editor.isActive("taskList"),
        link: editor.isActive("link"),
        highlight: editor.isActive("highlight"),
      },
    });
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    updateStates();
    editor.on("selectionUpdate", updateStates);
    editor.on("transaction", updateStates);
    return () => {
      editor.off("selectionUpdate", updateStates);
      editor.off("transaction", updateStates);
    };
  }, [editor, updateStates]);

  return {
    editorState,
    updateStates,
  };
};
