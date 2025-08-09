import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, Play } from "lucide-react";
import Link from "next/link"
import React from "react"

interface LessonItemsProps {
    lesson: {
        id: string,
        title: string,
        position: number,
        description: string | null,

    }
    slug: string,
    isActive?: boolean,
    isCompleted: boolean,
} 

const LessonItems = ({lesson, slug, isActive, isCompleted}: LessonItemsProps) => {

  return (
    <Link href={`/enrolled-course/${slug}/${lesson.id}`} className={buttonVariants({ 
        variant: "ghost",
        className: cn("w-full p-2 h-auto justify-start transition-all", 
            isActive && "bg-accent/30 rounded-sm"
        )
    })}>
        <div className="flex items-center gap-2 w-full min-w-0">
            <div className="shrink-0">
                {isCompleted ? (
                    <div className={cn("size-5 rounded-full bg-green-600/10 flex justify-center items-center")}>
                        <CheckCircle className={cn("size-3.5 text-green-600")}/>
                    </div>
                ):(
                    <div className={cn("size-5 rounded-full bg-destructive/10 flex justify-center items-center")}>
                        <Play className={cn("size-3 text-destructive")}/>
                    </div>                    
                )}
            </div>
            <div className={cn("leading-tight truncate")}>
                <span className={cn("text-muted-foreground")}>
                    {lesson.position}.
                </span>{" "} 
                <span>
                    {lesson.title}
                </span>
                {isCompleted && (<p className="text-xs w-fit p-1 rounded-full bg-green-600/10 text-green-600">Done</p>)}
                {isActive && !isCompleted && (<p className="text-xs w-fit p-1 rounded-full bg-destructive/10 text-destructive">In progress</p>)}         
            </div>
        </div>
    </Link>
  )
}

export default LessonItems;