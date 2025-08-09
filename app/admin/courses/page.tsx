import { buttonVariants } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import EmptyState from "./_components/EmptyState";
import { AdminCourses } from "@/app/data/admin/admin-courses";
import { CoursePagination } from "@/components/CoursePagination";
import AdminCourseCard from "./_components/AdminCourseCard";
import { AdminCourseCardSkeletonLayout } from "@/components/CardSkeleton";

export const metadata = {
    title: `Coursely | Courses`,
    description: "Manage courses in the admin panel.",
}

interface CoursesPageProps {
  searchParams: Promise<{ page?: string }>;
}

const LIMIT = 4;

const RenderCourses = ({ searchParams }: CoursesPageProps) => {

  return (
    <>
        <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Courses</h1>
                <Link 
                    className={buttonVariants()}
                    href="/admin/courses/create">
                    <PlusCircleIcon className="size-5" />
                    Create Course
                </Link>
            </div>
            <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
                <Courses searchParams={searchParams} />
            </Suspense>
        </div>
    </>
  )
}

export default RenderCourses;

async function Courses({ searchParams }: { searchParams: Promise<{ page?: string }> }) {

  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);

  const { data, total } = await AdminCourses(page, LIMIT);
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No Courses Found"
          description="Create a new course to get started."
          btnText="Create Course"
        />
      ) : (
        <>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
            {data.map((course) => (
              <AdminCourseCard key={course.id} data={course} />
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
