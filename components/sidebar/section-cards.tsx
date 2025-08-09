import { adminDashboardStats } from "@/app/data/admin/admin-dashboard"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GraduationCap, User2Icon, UserCheck2Icon, Video } from "lucide-react"

export async function SectionCards() {

  const {totalUsers, totalCustomers, totalCourses, totalLessons} = await adminDashboardStats();
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalUsers}
          </CardTitle>
          <CardAction className="bg-blue-600/10 rounded-lg p-2">
            <User2Icon className="size-7 text-blue-600"/>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Overview of all registered users.           
          </div>
          <div className="text-muted-foreground">
            Live count of all user accounts.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCustomers}
          </CardTitle>
          <CardAction className="bg-yellow-600/10 rounded-lg p-2">
            <UserCheck2Icon className="size-7 text-yellow-600"/>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total users who purchased a course.
          </div>
          <div className="text-muted-foreground">
            Tracks all enrolled customers.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Courses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCourses}
          </CardTitle>
          <CardAction className="bg-green-700/10 rounded-lg p-2">
            <GraduationCap className="size-7 text-green-600"/>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            All available courses in the platform.
          </div>
          <div className="text-muted-foreground">Includes every published and active course.</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Lessons</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalLessons}
          </CardTitle>
          <CardAction className="bg-destructive/10 rounded-lg p-2">
            <Video className="size-7 text-destructive"/>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Number of lessons across all courses.
          </div>
          <div className="text-muted-foreground">Covers every published lesson available to learners.</div>
        </CardFooter>
      </Card>
    </div>
  )
}
