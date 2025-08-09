import { enrollmentStats } from "@/app/data/admin/admin-enrollment-stats";
import { recentCourses } from "@/app/data/admin/admin-recent-courses";
import { AdminChartArea } from "@/components/sidebar/admin-chart-area";
import { SectionCards } from "@/components/sidebar/section-cards";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React, { Suspense } from "react"
import EmptyState from "../courses/_components/EmptyState";
import AdminCourseCard from "../courses/_components/AdminCourseCard";
import { AdminCourseCardSkeleton } from "@/components/CardSkeleton";

export const metadata = {
  title: "Coursely | Admin Dashboard",
  description: "Access powerful tools, insights, and management features in your Admin Dashboard. Monitor activity, manage users, and stay in control.",
};

const AdminDashboard = async () => {

    const enrollmentData = await enrollmentStats();

  return (
    <>
      <SectionCards /> 
      <div className="px-4 lg:px-6">
        <AdminChartArea data={enrollmentData} />
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xl">Recent Courses</h2>
            <Link 
            href={"/admin/courses"}
            className={buttonVariants({variant: "outline"})}>
              View all courses
            </Link>
          </div>
          <Suspense fallback={<RecentCoursesSkeletonLayout />}>
            <RenderRecentCourses />
          </Suspense>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard;

async function RenderRecentCourses() {

  const data = await recentCourses();

  if(data.length === 0) {
    return (
      <EmptyState 
        title="No Courses Found" 
        description="Create a new course to get started."
        btnText="Create Course"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} /> 
      ))}
    </div>
  )
}

function RecentCoursesSkeletonLayout() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({length: 2}).map((_, index) =>(
                <AdminCourseCardSkeleton key={index} />
            ))}
        </div>
    )
}