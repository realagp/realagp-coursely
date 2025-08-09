import React, { Suspense } from "react";
import { getArchivedCourses } from "@/app/data/admin/admin-archived-courses";
import EmptyFileState from "@/components/EmptyFileState";
import { CoursePagination } from "@/components/CoursePagination";
import ArchivedCourseCard from "./_components/ArchivedCourses";
import { AdminCourseCardSkeletonLayout } from "@/components/CardSkeleton";

export const metadata = {
    title: `Coursely | Archived Courses`,
    description: "Access and manage archived courses in the Coursely admin panel. Review course details, restore content, or permanently remove outdated materials.",
}

interface ArchivedCoursesPageProps {
  searchParams: Promise<{ page?: string }>;
}

const LIMIT = 4;

const RenderArchivedCourses = ({ searchParams }: ArchivedCoursesPageProps) => {

  return (
    <>
        <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Archived Courses</h1>
            <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
                <ArchivedCourses searchParams={searchParams} />
            </Suspense>
        </div>
    </>
  )
}

export default RenderArchivedCourses;

async function ArchivedCourses({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);

  const { data, total } = await getArchivedCourses(page, LIMIT);
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <>
      {data.length === 0 ? (
        <div className="mt-24">
          <EmptyFileState 
            title="No Archived Courses" 
            description="Archive a course to keep it for later without deleting it."
          />
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
            {data.map((course) => (
              <ArchivedCourseCard key={course.id} data={course} />
            ))}
          </div>
          <div className="mt-10">
            <CoursePagination totalPages={totalPages} currentPage={page} />
          </div>
        </>
      )}    
    </>
  );
}
