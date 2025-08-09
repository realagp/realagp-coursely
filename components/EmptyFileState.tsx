import { Ban } from "lucide-react";
import React from "react";

interface NotDataProps {
    title: string,
    description: string,
}

const EmptyFileState = ({title, description }: NotDataProps) => {
  return (
    <div 
    className="flex flex-col flex-1 h-full items-center justify-center p-4 text-center animate-in fade-in-50">
        <div className="flex size-16 rounded-full items-center justify-center bg-destructive/10">
            <Ban className="size-8 text-destructive" />
        </div>
        <h2 className="mt-4 font-semibold text-lg">{title}</h2>
        <p className="mt-2 text-md leading-tight text-center text-muted-foreground">{description}</p>
    </div>
  )
}

export default EmptyFileState;