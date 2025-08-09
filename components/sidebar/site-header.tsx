"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "../ui/mode-toggle"
import { usePathname } from "next/navigation"
import NotificationMenu from "../notification-menu"
import { useMemo } from "react"

const pathTitleMap: { [key: string]: string } = {
  "/admin/courses": "Courses",
  "/admin/courses/archived": "Archived Courses",
  "/admin/users": "Users",
  "/admin/courses/create": "Create Course",
  "/admin/dashboard": "Dashboard",
  "/dashboard": "Dashboard",
}

export function SiteHeader() {
  const pathname = usePathname()

  const { pageTitle } = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean)
    const coursesIndex = segments.findIndex((seg) => seg === "courses")
    const hasCourses = coursesIndex !== -1

    const isUUID = (str: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(str)

    const courseId = hasCourses ? segments[coursesIndex + 1] : null
    const lessonId = hasCourses ? segments[coursesIndex + 3] : null
    const isEditPage = segments.includes("edit")
    const isDeletePage = segments.includes("delete")
    const isCourseUUID = courseId && isUUID(courseId)
    const isLessonUUID = lessonId && isUUID(lessonId)

    const predefinedTitle = pathTitleMap[pathname]
    if (predefinedTitle) return { pageTitle: predefinedTitle }

    if (hasCourses && isCourseUUID && isDeletePage) {
      return { pageTitle: "Delete Course" }
    }

    if (hasCourses && isCourseUUID && isEditPage) {
      return { pageTitle: "Edit Course" }
    }

    if (hasCourses && isCourseUUID && isLessonUUID) {
      return { pageTitle: "Lesson Configuration" }
    }

    return { pageTitle: "Coursely" }
  }, [pathname])

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pageTitle}</h1>
        <div className="ml-auto">
          <div className="flex items-center gap-2">
            <NotificationMenu />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}


