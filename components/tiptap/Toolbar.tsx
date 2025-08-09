import { type Editor } from "@tiptap/react";
import React from "react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import { AlignCenter, AlignLeft, AlignRight, Bold, Heading1, Heading2, Heading3, Italic, ListIcon, ListOrdered, Redo, Strikethrough, Undo } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

interface EditorProps {
    editor: Editor | null;
}

const Toolbar = ({editor}: EditorProps) => {
  
    if (!editor) {
        return null;
    }

    return (
        <div className="border border-input border-t-0 border-x-0 p-2 bg-card flex flex-wrap items-center gap-1">
            <TooltipProvider>
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                            className={cn(editor.isActive("bold") && "bg-muted")}
                            size="sm" 
                            pressed={editor.isActive("bold")} 
                            onPressedChange={() => editor.chain().focus().toggleBold().run()}>
                                <Bold />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent className="font-bold">Bold</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                            className={cn(editor.isActive("italic") && "bg-muted")}
                            size="sm" 
                            pressed={editor.isActive("italic")} 
                            onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
                                <Italic />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent className="font-bold">Italic</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                            className={cn(editor.isActive("strike") && "bg-muted")}
                            size="sm" 
                            pressed={editor.isActive("strike")} 
                            onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
                                <Strikethrough />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent className="font-bold">Strike</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                            className={cn(editor.isActive("heading", {level: 1}) && "bg-muted")}
                            size="sm" 
                            pressed={editor.isActive("heading", {level: 1})} 
                            onPressedChange={() => editor.chain().focus().toggleHeading({level: 1}).run()}>
                                <Heading1 />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent className="font-bold">Heading 1</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                            className={cn(editor.isActive("heading", {level: 2}) && "bg-muted")}
                            size="sm" 
                            pressed={editor.isActive("heading", {level: 2})} 
                            onPressedChange={() => editor.chain().focus().toggleHeading({level: 2}).run()}>
                                <Heading2 />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent className="font-bold">Heading 2</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                            className={cn(editor.isActive("heading", {level: 3}) && "bg-muted")}
                            size="sm" 
                            pressed={editor.isActive("heading", {level: 3})} 
                            onPressedChange={() => editor.chain().focus().toggleHeading({level: 3}).run()}>
                                <Heading3 />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent className="font-bold">Heading 3</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                            className={cn(editor.isActive("bulletList") && "bg-muted")}
                            size="sm" 
                            pressed={editor.isActive("bulletList")} 
                            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
                                <ListIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent className="font-bold">Bullet List</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                            className={cn(editor.isActive("orderedList") && "bg-muted")}
                            size="sm" 
                            pressed={editor.isActive("orderedList")} 
                            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
                                <ListOrdered />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent className="font-bold">Ordered List</TooltipContent>
                    </Tooltip>
                </div>
                <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6" />
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                            className={cn(editor.isActive({textAlign: "left"}) && "bg-muted")}
                            size="sm" 
                            pressed={editor.isActive({textAlign: "left"})} 
                            onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}>
                                <AlignLeft />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent className="font-bold">Align Left</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                            className={cn(editor.isActive({textAlign: "center"}) && "bg-muted")}
                            size="sm" 
                            pressed={editor.isActive({textAlign: "center"})} 
                            onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}>
                                <AlignCenter />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent className="font-bold">Align Center</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                            className={cn(editor.isActive({textAlign: "right"}) && "bg-muted")}
                            size="sm" 
                            pressed={editor.isActive({textAlign: "right"})} 
                            onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}>
                                <AlignRight />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent className="font-bold">Align Right</TooltipContent>
                    </Tooltip>
                </div>
                <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6" />
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="inline-block hover:bg-secondary/80 rounded-md">
                                <Button 
                                size="sm" 
                                variant="ghost"
                                type="button"
                                disabled={!editor.can().undo()} 
                                onClick={() => editor.chain().focus().undo().run()}>
                                    <Undo />
                                </Button>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent className="font-bold">Undo</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="inline-block hover:bg-secondary/80 rounded-md">
                                <Button
                                size="sm" 
                                variant="ghost"
                                type="button"
                                disabled={!editor.can().redo()} 
                                onClick={() => editor.chain().focus().redo().run()}>
                                    <Redo />
                                </Button>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent className="font-bold">Redo</TooltipContent>
                    </Tooltip>
                </div>
                <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6" />
            </TooltipProvider> 
        </div>
    );
}

export default Toolbar;