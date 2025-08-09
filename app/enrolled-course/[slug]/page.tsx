import React from "react"
import { getSidebarData } from "../../data/course/get-sidebar-data";
import { redirect } from "next/navigation";
import EmptyFileState from "@/components/EmptyFileState";

interface SidebarProps {
  params: Promise<{ slug: string }>;
}

const EnrolledCourse = async ({ params }: SidebarProps) => {

  const { slug } = await params;
  const course = await getSidebarData(slug);

  const firstChapter = course.course.chapter?.[0];
  const firstLesson = firstChapter?.lessons?.[0];

  if (firstLesson) {
    redirect(`/enrolled-course/${slug}/${firstLesson.id}`);
  }
  
  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center justify-center h-full text-center">
        <EmptyFileState
          title="No Lessons Yet"
          description="This chapter doesn't have any lessons yet."
        />
      </div>
    </div>
  )
}

export default EnrolledCourse;