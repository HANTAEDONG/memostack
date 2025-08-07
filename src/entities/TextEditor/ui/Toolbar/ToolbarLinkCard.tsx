"use client";

import Card from "@/shared/ui/Card/Card";
import { useState } from "react";
import { Editor } from "@tiptap/core";
import { EditorActionInstance } from "@/entities/TextEditor/model/editor.service";

interface ToolbarLinkCardProps {
  editor: Editor;
  setOpen: (open: boolean) => void;
}

const ToolbarLinkCard = ({ editor, setOpen }: ToolbarLinkCardProps) => {
  const [url, setUrl] = useState("");
  const [mention, setMention] = useState("");

  return (
    <Card className="absolute top-10 left-0 w-95 z-10 px-6 py-3">
      <div className="flex flex-col gap-2 w-fit">
        <div className="flex flex-col gap-1">
          <div className="text-sm font-semibold text-start">URL</div>
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
          <div className="text-sm font-semibold text-start">Mention</div>
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
          <div
            className="w-full h-full outline-none border border-gray-300 focus:border-gray-400 dark:border-gray-500 px-2 py-2 rounded-md bg-gray-200 opacity-80 dark:bg-gray-800 text-md cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </div>
          <div
            className="w-full h-full outline-none border border-gray-300 focus:border-gray-400 dark:border-gray-500 px-2 py-2 rounded-md bg-blue-500 text-white text-semibold cursor-pointer hover:bg-blue-600"
            onClick={() => {
              EditorActionInstance(editor)?.setLink(url);
              setOpen(false);
            }}
          >
            Apply
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ToolbarLinkCard;
