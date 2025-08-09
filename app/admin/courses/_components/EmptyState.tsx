import { buttonVariants } from "@/components/ui/button";
import { Ban, PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface NotDataProps {
    title: string,
    description: string,
    btnText: string,
}

const EmptyState = ({title, description, btnText}: NotDataProps) => {
  return (
    <div 
    className="flex flex-col flex-1 h-full items-center justify-center p-8 text-center animate-in fade-in-50">
        <div className="flex size-20 rounded-full items-center justify-center bg-destructive/10">
            <Ban className="size-10 text-destructive" />
        </div>
        <h2 className="mt-6 font-semibold text-xl">{title}</h2>
        <p className="mb-4 mt-2 text-md leading-tight text-center text-muted-foreground">{description}</p>
        <Link href="/admin/courses/create" className={buttonVariants({
            variant: "outline",
        })}>
           <PlusCircleIcon /> {btnText}
        </Link>
    </div>
  )
}

export default EmptyState;