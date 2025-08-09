
import { getLesson } from "@/app/data/course/get-lesson";
import React, { Suspense } from "react"
import LessonSkeleton from "../../_components/LessonSkeleton";
import LessonContent from "../../_components/LessonContent";

export async function generateMetadata({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = await getLesson(lessonId);

  return {
    title: `Coursely | ${lesson.title}`,
    description: lesson.description || "Lesson content",
  };
}

type Params = Promise<{lessonId: string}>

const LessonContents = async ({params}: {params: Params }) => {

    const { lessonId } =  await params;

  return (
      <div>
        <Suspense fallback={<LessonSkeleton />}>
          <LessonPanelContent lessonId={lessonId} />
        </Suspense>
      </div>
  ) 
}

export default LessonContents;

async function LessonPanelContent({lessonId}: {lessonId: string}) {

    const data = await getLesson(lessonId);

    return (
      <div className="px-4 lg:px-6">
        <LessonContent data={data} />
      </div>
    )
}