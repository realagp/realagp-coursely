import React, { Suspense } from "react"
import { getActiveCourses } from "../data/user/enrolled-courses";
import EmptyFileState from "@/components/EmptyFileState";
import { CoursePagination } from "@/components/CoursePagination";
import PublicCourseCard from "../(public)/_components/PublicCourseCard";
import { PublicCourseCardSkeletonLayout } from "@/components/CardSkeleton";

export const metadata = {
    title: `Coursely | Dashboard`,
    description: "Track your enrolled courses, monitor progress, and continue learning right from your user dashboard.",
}

interface ActiveCoursesPageProps {
  searchParams: Promise<{ page?: string }>;
}

const LIMIT = 4;

const RenderUserDashboard = async ({ searchParams }: ActiveCoursesPageProps) => {

  return (
    <>
      <div className="px-4 lg:px-6"> 
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">Enrolled Courses</h1>
            <p className="text-muted-foreground">View all the courses you’re currently enrolled in. Track your progress and access course materials—all in one place.</p>
          </div>
          <div className="mt-6">
            <Suspense fallback={<PublicCourseCardSkeletonLayout />}>
                <UserDashboard searchParams={searchParams}/>
            </Suspense>
          </div> 
      </div>
    </>

  )
}

export default RenderUserDashboard;

async function UserDashboard({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);

  const { data, total } = await getActiveCourses(page, LIMIT);
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="mt-6">
      {data.length === 0 ? (
        <div className="mt-32">
          <EmptyFileState 
            title="No Enrolled Courses"
            description="You’re not enrolled in any courses yet. Start exploring and join your first course."
           />                
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.map((course) => (
              <PublicCourseCard key={course.Course.id} data={course.Course} course={course}/>
            ))}
          </div>
          <div className="mt-10">
            <CoursePagination totalPages={totalPages} currentPage={page} />
          </div>        
        </>
      )}
    </div>
  );
}