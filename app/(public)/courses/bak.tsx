import { getAllCourses } from "@/app/data/course/get-all-courses";
import { getActiveCourses } from "@/app/data/user/enrolled-courses";
import React, { Suspense } from "react";
import EmptyFileState from "@/components/EmptyFileState";
import { CoursePagination } from "@/components/CoursePagination";
import { PublicCourseCardSkeletonLayout } from "@/components/CardSkeleton";
import PublicCourseCard from "../_components/PublicCourseCard";

export const metadata = {
    title: `Coursely | Courses`,
    description: "Discover courses that match your interests.",
}

interface PublicCoursesPageProps {
  searchParams: Promise<{ page?: string }>;
}

const LIMIT = 4;

const RenderPublicCourses = ({ searchParams }: PublicCoursesPageProps) => {
  return (
    <div className="mt-4">
        <div className="flex flex-col space-y-2 mb-10">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter">Explore Courses</h1>
            <p className="text-muted-foreground">Discover courses that match your interests. Learn at your own pace, anytime, anywhere.</p>
        </div>
        <Suspense fallback={<PublicCourseCardSkeletonLayout />}>
            <PublicCourses searchParams={searchParams}/>
        </Suspense>
    </div>
  )
}

export default RenderPublicCourses;

async function PublicCourses({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = Number(params?.page || 1);

  const [{ data: courses, total }, enrolledCourses] = await Promise.all([
    getAllCourses(page, LIMIT),
    getActiveCourses()
  ]);

  const enrolledCourseIds = Array.isArray(enrolledCourses)
    ? enrolledCourses.map((item) => item.Course?.id).filter(Boolean)
    : [];

  const filteredCourses = courses.filter(
    (course) => !enrolledCourseIds.includes(course.id)
  );

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="mt-4">
      {filteredCourses.length === 0 ? (
        <div className="mt-32">
          <EmptyFileState
            title="No Enrollable Courses at the Moment"
            description="Either you've enrolled in all available courses, or none are open for enrollment right now."
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <PublicCourseCard key={course.id} data={course} />
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
