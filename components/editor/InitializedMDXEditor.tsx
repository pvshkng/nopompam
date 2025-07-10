"use client";
// InitializedMDXEditor.tsx
import "@mdxeditor/editor/style.css";
import type { ForwardedRef } from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  BlockTypeSelect,
  ChangeAdmonitionType,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertAdmonition,
  InsertCodeBlock,
  InsertFrontmatter,
  InsertImage,
  InsertSandpack,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  ShowSandpackInfo,
} from "@mdxeditor/editor";

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        // Example Plugin Usage
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarClassName: "my-classname",
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <BlockTypeSelect />
              {/* <ChangeAdmonitionType /> */}
              {/* <ChangeCodeMirrorLanguage /> */}
              <CodeToggle />
              <CreateLink />
              {/* <DiffSourceToggleWrapper children /> */}
              <InsertAdmonition />
              <InsertCodeBlock />
              <InsertFrontmatter />
              <InsertImage />
              <InsertSandpack />
              <InsertTable />
              <InsertThematicBreak />
              <ListsToggle />
              {/* <ShowSandpackInfo /> */}
            </>
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
