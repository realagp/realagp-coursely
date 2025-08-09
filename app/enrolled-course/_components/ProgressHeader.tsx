"use client"

import { SidebarDataType } from '@/app/data/course/get-sidebar-data';
import { Progress } from '@/components/ui/progress';
import { useCourseProgress } from '@/hooks/use-course-progress';
import { Video } from 'lucide-react';
import React from 'react'

interface SidebarDataProps {
  course: SidebarDataType["course"];
}

const ProgressHeader = ({ course }: SidebarDataProps) => {

    const { totalLessons, completedLessons, progressPercentage } = useCourseProgress({data: course});
    
  return (
    <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
              <Video className="size-5 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base leading-tight truncate">{course.title}</h1>
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {course.category}
              </p>
            </div>
        </div>
        <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{completedLessons}/{totalLessons} lessons</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5" />
            <p className="text-xs text-muted-foreground">{progressPercentage}% complete</p>
        </div>
    </div>
  )
}

export default ProgressHeader;