import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Commands from "@/components/Chat/UserInput/Editor/extensions/commands";
import items from "@/components/Chat/UserInput/Editor/extensions/items";
import renderItems from "@/components/Chat/UserInput/Editor/extensions/renderItems";

const extensions = [
  StarterKit,
  Placeholder.configure({
    placeholder: "Type / for commands!",
    emptyEditorClass:
      "text-gray-500 relative before:content-[attr(data-placeholder)] before:absolute before:left-0 before:top-0 before:pointer-events-none before:opacity-50",
  }),
  Commands.configure({
    suggestion: {
      items: (props: any) => items({ ...props, setUsecase: setUsecase }),
      //render: renderItems,

      render: (props) => {
        const renderer = renderItems();
        return {
          onStart: (...args) => {
            setIsSlashCommandActive(true);
            renderer.onStart(...args);
          },
          onExit: (...args) => {
            setIsSlashCommandActive(false);
            renderer.onExit(...args);
          },
          // ... rest of your render configuration
        };
      },
    },
  }),
];

export const editor = useEditor({
  extensions: extensions,
  //content: content,
  editorProps: {
    attributes: {
      autofocus: "true",
      class: cn(
        "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none"
      ),
    },
  },
});
