"use client";

import { Editor, useEditorState } from "@tiptap/react";
import { useState } from "react";
import {
  headingOptions,
  listOptions,
  toolbarOptions,
} from "../lib/editor.options";
import Toolbar from "@/entities/TextEditor/ui/Toolbar/index";
import { EditorState } from "../lib/editor.types";

interface ToolbarProps {
  editor: Editor;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ToolbarComponent = ({
  editor,
  isDarkMode,
  toggleDarkMode,
}: ToolbarProps) => {
  const editorState = useEditorState({
    editor,
    selector: ({ editor }: { editor: Editor }) =>
      ({
        activeMarks: {
          bold: editor.isActive("bold"),
          italic: editor.isActive("italic"),
          underline: editor.isActive("underline"),
          strike: editor.isActive("strike"),
          highlight: editor.isActive("highlight"),
          link: editor.isActive("link"),
        },
        activeNodes: {
          heading: editor.isActive("heading")
            ? editor.getAttributes("heading").level
            : null,
          blockquote: editor.isActive("blockquote"),
          codeBlock: editor.isActive("codeBlock"),
          orderedList: editor.isActive("orderedList"),
          bulletList: editor.isActive("bulletList"),
          taskList: editor.isActive("taskList"),
          link: editor.isActive("link"),
          textAlign: editor.isActive("textAlign")
            ? editor.getAttributes("textAlign").align
            : null,
        },
      } as EditorState),
  });

  const [open, setOpen] = useState(false);

  return (
    <Toolbar.Container>
      <div className="flex gap-1 border-r border-gray-200 pr-2">
        <Toolbar.Button
          className={`w-8 h-8 flex items-center justify-center`}
          onClick={() => {
            toolbarOptions.undo.action(editor);
          }}
          disabled={!editor?.can().undo()}
        >
          <Toolbar.Icon
            name="Undo"
            className={`${
              editor?.can().undo()
                ? "text-gray-700 dark:text-[oklch(60%_0_0)]"
                : "text-gray-300 dark:text-gray-500"
            }`}
          />
        </Toolbar.Button>
        <Toolbar.Button
          className={`w-8 h-8 flex items-center justify-center`}
          onClick={() => {
            toolbarOptions.redo.action(editor);
          }}
          disabled={!editor?.can().redo()}
        >
          <Toolbar.Icon
            name="Redo"
            className={`${
              editor?.can().redo()
                ? "text-gray-700 dark:text-[oklch(60%_0_0)]"
                : "text-gray-300 dark:text-gray-500"
            }`}
          />
        </Toolbar.Button>
      </div>
      <div className="flex gap-1 border-r border-gray-200 pr-2">
        <Toolbar.Dropdown options={headingOptions} editor={editor} />
        <Toolbar.Dropdown options={listOptions} editor={editor} />
        <Toolbar.Button
          onClick={() => {
            toolbarOptions.codeBlock.action(editor);
          }}
        >
          <Toolbar.Icon name="Code" />
        </Toolbar.Button>
        <Toolbar.Button
          onClick={() => {
            toolbarOptions.blockquote.action(editor);
          }}
        >
          <Toolbar.Icon
            name="Quote"
            isActive={editorState.activeNodes.blockquote}
          />
        </Toolbar.Button>
      </div>
      <div className="flex gap-1 border-r border-gray-200 pr-2">
        <Toolbar.Button
          onClick={() => {
            toolbarOptions.bold.action(editor);
          }}
        >
          <Toolbar.Icon name="Bold" isActive={editorState.activeMarks.bold} />
        </Toolbar.Button>
        <Toolbar.Button
          onClick={() => {
            toolbarOptions.italic.action(editor);
          }}
        >
          <Toolbar.Icon
            name="Italic"
            isActive={editorState.activeMarks.italic}
          />
        </Toolbar.Button>
        <Toolbar.Button
          onClick={() => {
            toolbarOptions.underline.action(editor);
          }}
        >
          <Toolbar.Icon
            name="Underline"
            isActive={editorState.activeMarks.underline}
          />
        </Toolbar.Button>
        <Toolbar.Button
          onClick={() => {
            toolbarOptions.strike.action(editor);
          }}
        >
          <Toolbar.Icon
            name="Strikethrough"
            isActive={editorState.activeMarks.strike}
          />
        </Toolbar.Button>
        <Toolbar.Button
          onClick={() => {
            toolbarOptions.highlight.action(editor);
          }}
        >
          <Toolbar.Icon
            name="Highlighter"
            isActive={editorState.activeMarks.highlight}
          />
        </Toolbar.Button>
        <Toolbar.Button onClick={() => setOpen(true)}>
          <Toolbar.Icon name="Link" isActive={editorState.activeMarks.link} />
        </Toolbar.Button>
        {open && <Toolbar.LinkCard editor={editor} setOpen={setOpen} />}
      </div>
      <div className="flex gap-1 border-r border-gray-200 pr-2">
        <Toolbar.Button
          onClick={() => {
            toolbarOptions.textAlignLeft.action(editor);
          }}
        >
          <Toolbar.Icon
            name="AlignLeft"
            isActive={editorState.activeNodes.textAlign === "left"}
          />
        </Toolbar.Button>
        <Toolbar.Button
          onClick={() => {
            toolbarOptions.textAlignCenter.action(editor);
          }}
        >
          <Toolbar.Icon name="AlignCenter" />
        </Toolbar.Button>
        <Toolbar.Button
          onClick={() => {
            toolbarOptions.textAlignRight.action(editor);
          }}
        >
          <Toolbar.Icon name="AlignRight" />
        </Toolbar.Button>
        <Toolbar.Button
          onClick={() => {
            toolbarOptions.textAlignJustify.action(editor);
          }}
        >
          <Toolbar.Icon name="AlignJustify" />
        </Toolbar.Button>
      </div>
      <Toolbar.Button onClick={toggleDarkMode}>
        <Toolbar.Icon name={isDarkMode ? "Sun" : "Moon"} />
      </Toolbar.Button>
    </Toolbar.Container>
  );
};

export default ToolbarComponent;
