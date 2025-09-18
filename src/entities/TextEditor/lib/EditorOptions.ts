import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
// import TaskList from "@tiptap/extension-task-list";
// import TaskListItem from "@tiptap/extension-task-item";
import { Editor } from "@tiptap/react";

const EditorOptions = {
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      bulletList: {
        HTMLAttributes: {
          class: "list-disc list-outside ml-4",
        },
      },
      orderedList: {
        HTMLAttributes: {
          class: "list-decimal list-outside ml-4",
        },
      },
      listItem: {
        HTMLAttributes: {
          class: "mb-1",
        },
      },
    }),
    Highlight,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    // TaskList.configure({
    //   HTMLAttributes: {
    //     class: "task-list",
    //   },
    // }),
    // TaskListItem.configure({
    //   nested: true,
    // }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      protocols: ["http", "https"],
      isAllowedUri: (url, ctx) => {
        try {
          const parsedUrl = url.includes(":")
            ? new URL(url)
            : new URL(`${ctx.defaultProtocol}://${url}`);
          if (!ctx.defaultValidate(parsedUrl.href)) {
            return false;
          }
          const disallowedProtocols = ["ftp", "file", "mailto"];
          const protocol = parsedUrl.protocol.replace(":", "");
          if (disallowedProtocols.includes(protocol)) {
            return false;
          }
          const allowedProtocols = ctx.protocols.map((p) =>
            typeof p === "string" ? p : p.scheme
          );
          if (!allowedProtocols.includes(protocol)) {
            return false;
          }
          const disallowedDomains = [
            "example-phishing.com",
            "malicious-site.net",
          ];
          const domain = parsedUrl.hostname;
          if (disallowedDomains.includes(domain)) {
            return false;
          }
          return true;
        } catch {
          return false;
        }
      },
      shouldAutoLink: (url) => {
        try {
          const parsedUrl = url.includes(":")
            ? new URL(url)
            : new URL(`https://${url}`);
          const disallowedDomains = [
            "example-no-autolink.com",
            "another-no-autolink.com",
          ];
          const domain = parsedUrl.hostname;
          return !disallowedDomains.includes(domain);
        } catch {
          return false;
        }
      },
    }),
  ],
  immediatelyRender: false,
  autofocus: false,
  enableContentCheck: true,
  onContentError({ error }: { error: Error }) {
    console.error(error);
  },
  editorProps: {
    attributes: {
      class:
        "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none focus:ring-0",
    },
  },
  onUpdate: ({ editor }: { editor: Editor }) => {
    editor.view.updateState(editor.view.state);
  },
  onSelectionUpdate: ({ editor }: { editor: Editor }) => {
    editor.view.updateState(editor.view.state);
  },
};

export default EditorOptions;
