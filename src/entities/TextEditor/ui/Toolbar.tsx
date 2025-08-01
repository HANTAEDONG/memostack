import {
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Redo,
  Strikethrough,
  Underline,
} from "lucide-react";

import { Editor } from "@tiptap/react";
import { EditorActions } from "../lib/editor.actions";
import ToolbarButton from "./ToolbarButton";
import LucideIcon from "@/shared/ui/Icon/LucideIcon";
import ToolbarDropDown from "./ToolbarDropDown";
import { useRef } from "react";
import { useEditorState } from "../lib/useEditorState";

const Toolbar = ({ editor }: { editor: Editor }) => {
  const actions = new EditorActions(editor);
  const ref = useRef<HTMLDivElement>(null);
  const { editorState } = useEditorState(editor);

  const HeadingOptions = [
    {
      key: "제목1",
      element: <Heading1 size={20} />,
      isActive: editor?.isActive("heading", { level: 1 }),
      action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      key: "제목2",
      element: <Heading2 size={20} />,
      isActive: editor?.isActive("heading", { level: 2 }),
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      key: "제목3",
      element: <Heading3 size={20} />,
      isActive: editor?.isActive("heading", { level: 3 }),
      action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
    },
  ];

  return (
    <div className="w-full h-[44px] relative flex justify-center items-center bg-white dark:bg-[rgb(14, 14, 17)] border-b border-gray-200">
      <div
        className="flex gap-2 dark:text-white"
        style={{ color: "rgb(14, 14, 17)" }}
      >
        <div className="flex gap-1 border-r border-gray-200 pr-2">
          <ToolbarButton
            className={`w-8 h-8 flex items-center justify-center ${
              editor?.can().undo() ? "text-white" : "text-gray-500"
            }`}
            onClick={() => {
              actions?.undo();
            }}
            disabled={!editor?.can().undo()}
          >
            <LucideIcon name="Undo" />
          </ToolbarButton>
          <ToolbarButton
            className={`w-8 h-8 flex items-center justify-center ${
              editor?.can().redo() ? "text-white" : "text-gray-500"
            }`}
            onClick={() => actions?.redo()}
            disabled={!editor?.can().redo()}
          >
            <Redo size={16} />
          </ToolbarButton>
        </div>
        <div className="flex gap-1 border-r border-gray-200 pr-2">
          <ToolbarDropDown options={HeadingOptions} ref={ref} />
        </div>
        <div className="flex gap-1 border-r border-gray-200 pr-2">
          <ToolbarButton onClick={() => actions?.toggleBold()}>
            <LucideIcon
              name="Bold"
              className={`${
                editorState.activeMarks.bold ? "text-blue-500" : "text-black"
              }`}
            />
          </ToolbarButton>
          <ToolbarButton onClick={() => actions?.toggleItalic()}>
            <Italic
              size={16}
              className={`${
                editorState.activeMarks.italic ? "text-blue-500" : "text-black"
              }`}
            />
          </ToolbarButton>
          <ToolbarButton onClick={() => actions?.toggleUnderline()}>
            <Underline
              size={16}
              className={`${
                editorState.activeMarks.underline
                  ? "text-blue-500"
                  : "text-black"
              }`}
            />
          </ToolbarButton>
          <ToolbarButton onClick={() => actions?.toggleStrike()}>
            <Strikethrough
              size={16}
              className={`${
                editorState.activeMarks.strike ? "text-blue-500" : "text-black"
              }`}
            />
          </ToolbarButton>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
