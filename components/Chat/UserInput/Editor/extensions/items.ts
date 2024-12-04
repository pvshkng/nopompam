import tippy from "tippy.js";

import CommandsList from "./CommandsList";

interface CommandItem {
  title: string;
  command: ({ editor, range }: { editor: any; range: any }) => void;
}

const items = (
  {
    query,
    setUsecase,
  }: {
    query: string;
    setUsecase: (value: string) => void;
  } = {
    query: "",
    setUsecase: () => {},
  }
): CommandItem[] => {
  const commands: CommandItem[] = [
    {
      title: "ask pdf",
      command: ({ editor, range }) => {
        setUsecase("askPdf");
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run();
      },
    },
    {
      title: "ask sql",
      command: ({ editor, range }) => {
        setUsecase("askSql");
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      },
    },
    {
      title: "search internet",
      command: ({ editor, range }) => {
        setUsecase("searchInternet");
        editor.chain().focus().deleteRange(range).setMark("bold").run();
      },
    },
    /* {
      title: "italic",
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setMark("italic").run();
      },
    },
    {
      title: "image",
      command: ({ editor, range }) => {
        console.log("call some function from parent");
        editor.chain().focus().deleteRange(range).setNode("paragraph").run();
      },
    }, */
  ];

  if (!query) {
    return commands;
  }

  return commands
    .filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10);
};

export default items;
