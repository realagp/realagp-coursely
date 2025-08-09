"use client";

import { SidebarDataType } from "@/app/data/course/get-sidebar-data";
import { Button } from "@/components/ui/button";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { Collapsible, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { ChevronDown} from "lucide-react";
import React from "react";

import { usePathname } from "next/navigation";
import LessonItems from "./LessonItems";

interface SidebarDataProps {
  course: SidebarDataType["course"];
}

const ProgressContent = ({ course }: SidebarDataProps) => {
  const pathname = usePathname();
  const currentLessonId = pathname.split("/").pop();

  return (
    <div className="flex flex-col h-full p-2">
      <div className="py-4 space-y-3">
        {course.chapter.map((chapter, index) => (
          <Collapsible key={chapter.id} defaultOpen={index === 0}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full p-3 h-auto flex items-center gap-2 rounded border-none"
              >
                <div className="shrink-0">
                  <ChevronDown className="size-5 bg-muted-foreground/10 rounded text-foreground" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div>
                    <p className="font-semibold text-sm truncate text-foreground">
                      {chapter.position}: {chapter.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {chapter.lessons.length} Lessons
                    </p>
                  </div>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 pl-2 border-l-2 border-border space-y-3">
              {chapter.lessons.map((lesson) => (
                <LessonItems
                  key={lesson.id}
                  lesson={lesson}
                  slug={course.slug}
                  isActive={currentLessonId === lesson.id}
                  isCompleted={lesson.lessonProgress.find((progress) => 
                    progress.lessonId === lesson.id
                  )?.completed || false}
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default ProgressContent;
