import { manageLesson } from "@/app/data/admin/admin-manage-lesson";
import LessonForm from "./_components/LessonForm";

export async function generateMetadata({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = await manageLesson(lessonId);

  return {
    title: `Coursely | ${lesson?.title || "Edit Lesson"}`,
    description: `Modify lesson content and configuration for "${lesson?.title}".`,
  };
}

type Params = Promise<{
    courseId: string,
    chapterId: string,
    lessonId: string
}>

const LessonConfiguration = async ({params}:{params: Params}) => {

    const { courseId, chapterId, lessonId} = await params;
    const lesson = await manageLesson(lessonId); 

    return (
        <LessonForm data={lesson} chapterId={chapterId} courseId={courseId} />
    )
}

export default LessonConfiguration;