"use client"

import { SidebarDataType } from "@/app/data/course/get-sidebar-data";
import { ActiveCoursesType } from "@/app/data/user/enrolled-courses";
import { Progress } from "@/components/ui/progress";
import { useCourseProgress } from "@/hooks/use-course-progress";
import React from "react"

interface ActiveCoursesProps {
    course: ActiveCoursesType,
}

const CourseProgressData = ({course}: ActiveCoursesProps) => {

 const { totalLessons, completedLessons, progressPercentage } = useCourseProgress({data: course.Course as unknown as SidebarDataType["course"]});
 
  return (
    <div className="mt-3 space-y-4">
        <div className="flex justify-between mb-1 text-xs">
            <p className="font-medium">Progress: {""}
                <span className="text-destructive italic bg-destructive/10 px-3 rounded-full">{completedLessons} of {totalLessons} lessons completed</span>
            </p>
            <p className="font-medium text-destructive">{progressPercentage}%</p>
        </div>
        <Progress value={progressPercentage} className="h-1.5" />
    </div>
  )
}

export default CourseProgressData;