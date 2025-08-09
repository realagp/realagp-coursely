import { manageCourse } from "@/app/data/admin/admin-manage-course";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import EditCourseForm from "./_components/EditCourseForm";
import CourseOutline from "./_components/CourseOutline";

export async function generateMetadata({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;

  const data = await manageCourse(courseId);

  return {
    title: `Coursely | ${data?.title || "Edit Course"}`,
    description: `Edit course information and structure for "${data?.title}".`,
  };
}

type Params = Promise<{courseId: string}>;

const EditCourse = async ({params}:{params:Params}) => {

    const { courseId } = await params;
    const data = await manageCourse(courseId);

  return (
    <div className="px-4 lg:px-6">
        <div className="flex items-center mb-6">
            <Link 
            className={buttonVariants({ variant: "outline" })}
            href="/admin/courses">
                <Undo2 className="size-5"/> Go Back
            </Link>
        </div>
        <Tabs defaultValue="course-info" className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="course-info">INFORMATION</TabsTrigger>
                <TabsTrigger value="course-structure">OUTLINE</TabsTrigger>
            </TabsList>
            <TabsContent value="course-info">
                <Card>
                    <CardHeader>
                        <CardTitle>Course Information</CardTitle>
                        <CardDescription>Edit the fields below to modify the course information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EditCourseForm data={data}/>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="course-structure">
                <Card>
                    <CardHeader>
                        <CardTitle>Course Outline</CardTitle>
                        <CardDescription>Modify the chapter sequence and learning flow.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CourseOutline data={data} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  )
}

export default EditCourse;