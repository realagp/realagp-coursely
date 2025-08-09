import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function PublicCourseCardSkeleton () {

    return (
        <Card className="group relative py-0 gap-0">
            <div className="absolute top-4 right-4 z-10">
                <Skeleton className="h-7 w-20 rounded-lg" />
            </div>
            <div className="w-full h-fit relative">
                <Skeleton className="w-full rounded-t-lg aspect-video object-cover" />
            </div>
            <CardContent className="p-4">
                <Skeleton className="h-8 w-3/4 mb-4 rounded-lg" />
                <Skeleton className="h-10 w-full mb-4 rounded-lg"/>
                <Skeleton className="h-8 w-full mt-4 rounded-lg" />
                <Skeleton className="h-10 w-full mt-4 rounded-lg" />
            </CardContent>       
        </Card>
    )
}

export function PublicCourseCardSkeletonLayout() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({length: 4}).map((_, index) =>(
                <PublicCourseCardSkeleton key={index} />
            ))}
        </div>
    )
}

export function AdminCourseCardSkeleton () {

  return (
    <Card className="group relative py-0 gap-0">
      <div className="flex flex-col gap-2 absolute top-4 right-4 z-10">
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="size-8 rounded-md"/>
      </div>
      <div className="w-full h-fit relative">
        <Skeleton className="w-full rounded-t-lg aspect-video h-[256px] object-cover" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-8 w-3/4 mb-2 rounded-lg" />
        <Skeleton className="h-10 w-full mb-4 rounded-lg"/>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-1">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-5 w-12 rounded"/> 
          </div>
          <div className="flex items-center gap-x-1">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-5 w-16 rounded"/>
            <Skeleton className="h-7 w-16 top-4 left-4 absolute rounded-md"/> 
          </div>
        </div>     
      </CardContent>
    </Card>
  )
}

export function AdminCourseCardSkeletonLayout() {
    return (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
            {Array.from({length: 4}).map((_, index) =>(
                <AdminCourseCardSkeleton key={index} />
            ))}
        </div>
    )
}