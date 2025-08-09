import { CourseType } from "@/app/data/admin/admin-manage-courses";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ConstructedUrl } from "@/hooks/object-url";
import { 
  Edit3Icon, 
  GraduationCap, 
  HourglassIcon, 
  LinkIcon, 
  MoreVerticalIcon, 
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CoursesProps {
    data: CourseType,
}

const statusVariantMap = {
  Draft: "Draft",
  Published: "Published",
  Archived: "Archived",
} as const;

const ArchivedCourseCard = ({data}: CoursesProps) => {

    const thumbnailUrl = ConstructedUrl(data.fileKey);

  return (
    <Card className="group relative py-0 gap-0">
        {/* absulte dropdown */}
        <div className="flex flex-col gap-2 absolute top-4 right-4 z-10">
          <Link href={`/courses/${data.slug}`} 
            className={buttonVariants({
            variant: "secondary",
            size: "icon"
          })}>
            <LinkIcon className="size-4"/>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-muted-foreground">Manage</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/courses/${data.id}/edit`}>
                  <Edit3Icon className="size-5" /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/courses/${data.id}/delete`}>
                  <Trash2 className="size-4 text-destructive" /> Delete
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Image 
          src={thumbnailUrl} 
          alt="Thumbnail" 
          width={600} 
          height={400}
          className="w-full rounded-t-lg aspect-video h-full object-cover" 
        />
        <CardContent className="p-4">
          <Link 
            href={`/admin/courses/${data.id}/edit`}
            className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors">
              {data.title}
          </Link>
          <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
            {data.shortDescription}
          </p>
          <div className="mt-4 flex items-center gap-x-5">
            <div className="flex items-center gap-x-1">
              <HourglassIcon className="size-6 p-1 rounded-md font-bold text-yellow-600 bg-yellow-700/10"/>
              <p className="text-sm text-muted-foreground">{data.duration} Hours</p>
            </div>
            <div className="flex items-center gap-x-1">
              <GraduationCap className="size-6 p-1 rounded-md font-bold text-green-600 bg-green-700/10"/>
              <p className="text-sm text-muted-foreground">{data.level}</p>
            </div>
            <Badge 
            variant={statusVariantMap[data.status as keyof typeof statusVariantMap]} 
            className="absolute top-4 left-4 z-10">
            {data.status}
            </Badge>
          </div>
        </CardContent>
    </Card>
  )
}

export default ArchivedCourseCard;