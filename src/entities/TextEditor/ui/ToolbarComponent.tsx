import { Editor } from "@tiptap/react";
import { useRef, useState } from "react";
import { useEditorState } from "../model/useEditorState";
import {
  headingOptions,
  listOptions,
  toolbarOptions,
} from "../model/editor.options";
import Card from "@/shared/ui/Card/Card";
import Toolbar from "@/entities/TextEditor/ui/Toolbar/index";

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
  const ref = useRef<HTMLDivElement>(null);
  const { editorState } = useEditorState(editor);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [mention, setMention] = useState("");

  return (
    <div className="w-full h-[44px] relative border-b border-gray-200 rounded-t-lg">
      <div
        className="w-full h-full overflow-x-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="flex gap-2 dark:text-white min-w-max px-4 whitespace-nowrap h-full items-center">
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
            <Toolbar.Dropdown
              options={headingOptions}
              editor={editor}
              ref={ref}
            />
            <Toolbar.Dropdown options={listOptions} editor={editor} ref={ref} />
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
              <Toolbar.Icon
                name="Bold"
                isActive={editorState.activeMarks.bold}
              />
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
              <Toolbar.Icon
                name="Link"
                isActive={editorState.activeMarks.link}
              />
              {open && (
                <Card className="absolute top-10 left-0 w-95 z-10 px-6 py-3">
                  <div className="flex flex-col gap-2 w-fit">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-semibold text-start">
                        URL
                      </div>
                      <input
                        className="w-83 h-full outline-none border border-gray-300 focus:border-gray-400 dark:border-gray-500 px-2 py-2 rounded-md bg-gray-200 opacity-80 dark:bg-gray-800 text-md"
                        placeholder="example.com"
                        value={url}
                        onChange={(e) => {
                          setUrl(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-semibold text-start">
                        Mention
                      </div>
                      <input
                        className="w-full h-full outline-none border border-gray-300 focus:border-gray-400 dark:border-gray-500 px-2 py-2 rounded-md bg-gray-200 opacity-80 dark:bg-gray-800 text-md"
                        placeholder="example"
                        value={mention}
                        onChange={(e) => {
                          setMention(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button className="w-full h-full outline-none border border-gray-300 focus:border-gray-400 dark:border-gray-500 px-2 py-2 rounded-md bg-gray-200 opacity-80 dark:bg-gray-800 text-md">
                        Cancel
                      </button>
                      <button className="w-full h-full outline-none border border-gray-300 focus:border-gray-400 dark:border-gray-500 px-2 py-2 rounded-md bg-blue-500 text-white text-semibold">
                        Apply
                      </button>
                    </div>
                  </div>
                </Card>
              )}
            </Toolbar.Button>
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
          <div>
            <Toolbar.Button onClick={toggleDarkMode}>
              <Toolbar.Icon name={isDarkMode ? "Sun" : "Moon"} />
            </Toolbar.Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolbarComponent;
