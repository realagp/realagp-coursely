"use client"

import TextAlign from "@tiptap/extension-text-align";
import { generateHTML } from '@tiptap/html'
import { type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import parse from 'html-react-parser';
import React, { useMemo } from "react";

const RenderDescription = ({json}: {json: JSONContent}) => {

    const output = useMemo(() => {
        return generateHTML(json, [
            StarterKit,
            TextAlign.configure({
            types: ['heading', 'paragraph'],
            })
        ]);
    },[json]);

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">{parse(output)}</div>
  )
}

export default RenderDescription;