import CourseProgressData from "@/app/dashboard/_components/Progress";
import { PublicPaginatedCourseType } from "@/app/data/course/get-all-courses";
import { ActiveCoursesType } from "@/app/data/user/enrolled-courses";
import { purchasedVerification } from "@/app/data/user/user-enrolled";
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
import { ConstructedUrl } from "@/hooks/object-url";
import { IconCategory2 } from "@tabler/icons-react";
import { ArrowUpRight, HourglassIcon, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CoursesProps {
    data: PublicPaginatedCourseType,
    course?: ActiveCoursesType,
}

const levelVariantMap = {
  Beginner: "Beginner",
  Intermediate: "Intermediate",
  Advanced: "Advanced",
} as const;

const PublicCourseCard = async ({data, course}: CoursesProps) => {
 
    const thumbnailUrl = ConstructedUrl(data.fileKey);
    const isEnrolled = await purchasedVerification(data.id);

  return (
    <div>
        <Card className="group relative py-0 gap-0">
            <Badge 
            variant={levelVariantMap[data.level as keyof typeof levelVariantMap]} 
            className="absolute top-4 right-4 z-10"
            >
            {data.level}
            </Badge>
            <Image 
            src={thumbnailUrl} 
            alt="Thumbnail" 
            width={600} 
            height={400}
            className="w-full rounded-t-lg aspect-video h-full object-cover" />
            <CardContent className="p-4">
                <Link 
                className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors" 
                href={`/courses/${data.slug}`}>
                    {data.title}
                </Link>
                <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">{data.shortDescription}</p>
                {isEnrolled && course ? (
                    <>
                    <CourseProgressData course={course} />
                    <Link 
                    href={`/enrolled-course/${data.slug}`} 
                    className={buttonVariants({
                        variant: "outline",
                        className: "w-full mt-4"
                    })}>
                        <Video className="size-5" /> Watch Course
                    </Link>                      
                    </>                 
                ):(
                    <>
                        <div className="mt-4 flex items-center gap-x-5">
                            <div className="flex items-center gap-x-1">
                            <HourglassIcon className="size-6 p-1 rounded-md font-bold text-yellow-600 bg-yellow-700/10"/>
                            <p className="text-sm text-muted-foreground">{data.duration} Hours</p>
                            </div>
                            <div className="flex items-center gap-x-1">
                            <IconCategory2 className="size-6 p-1 rounded-md font-bold text-green-600 bg-green-700/10"/>
                            <p className="text-sm text-muted-foreground">{data.category}</p>
                            </div>
                        </div>
                        <Link 
                        href={`/courses/${data.slug}`} 
                        className={buttonVariants({
                            variant: "outline",
                            className: "w-full mt-4"
                        })}>
                            Learn more <ArrowUpRight className="size-5" />
                        </Link>
                    </>
                )}
            </CardContent>   
        </Card>
    </div>
  )
}

export default PublicCourseCard;