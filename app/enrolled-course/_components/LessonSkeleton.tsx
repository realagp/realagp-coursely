import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

const LessonSkeleton = () => {
  return (
    <div className="px-4 lg:px-6">
        <div className="flex flex-col h-full">
            <div className="aspect-video rounded-lg bg-background relative overflow-hidden">
                <Skeleton className="w-full h-full" />
            </div>
            <div className="py-4">
                <Skeleton className="w-32 h-8" />
            </div>
            <div className="pt-6 space-y-4">
                <Skeleton className="w-full h-10" />
            </div>
        </div>
    </div>

  )
}

export default LessonSkeleton;