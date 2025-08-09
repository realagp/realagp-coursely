"use client"

import { SidebarDataType } from "@/app/data/course/get-sidebar-data";
import { useMemo } from "react";

interface CourseProgressProps {
    data: SidebarDataType["course"];
}

interface CoureProgressResult {
    totalLessons: number,
    completedLessons: number,
    progressPercentage: number,
}

export function useCourseProgress({data}: CourseProgressProps): CoureProgressResult {
    return useMemo(() => {
        let totalLessons = 0;
        let completedLessons = 0;

        data.chapter.forEach((chapter) => {
            chapter.lessons.forEach((lesson) => {
                totalLessons++;

                const isCompleted = lesson.lessonProgress.some((progress) => 
                    progress.lessonId === lesson.id && progress.completed
                )

                if(isCompleted) {
                    completedLessons++;
                }
            })
        })

        const progressPercentage = totalLessons > 0 
        ? Math.round((completedLessons / totalLessons) * 100 )
        : 0;

        return {
            totalLessons,
            completedLessons,
            progressPercentage
        }
    }, [data])
}