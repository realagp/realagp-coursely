import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import TextAlign from '@tiptap/extension-text-align'

const Editor = ({field}: {field: any}) => {

  const editor = useEditor({
    extensions: [
        StarterKit,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        })
    ],
    
    editorProps: {
        attributes: {
            class: "min-h-[300px] p-4 focus:outline-none prose prose-base sm:prose-sm lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
        }
    },

    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },

    content: field.value ? JSON.parse(field.value) : "",
  });

  return (
    <div className="w-full border border-input rounded-md overflow-hidden dark:bg-secondary">
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />
    </div> 
  )
}

export default Editor