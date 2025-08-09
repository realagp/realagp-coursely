"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { generateSlug } from "@/lib/utils/slug";
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { Loader2, Save, SparkleIcon, Undo2 } from "lucide-react";
import Link from "next/link";
import React, { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { courseCategories, courseLevels, courseSchema, CourseSchemaType, courseStatus } from "@/lib/validations";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Editor from "@/components/tiptap/Editor";
import FileUploader from "@/components/Uploader";
import { Textarea } from "@/components/ui/textarea";
import { tryCatch } from "@/hooks/try-catch";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfetti } from "@/hooks/confetti";
import { CreateNewCourse } from "../actions";

const CreateCourse = () => {

    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const {triggerConfetti} = useConfetti();

    const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: "",
            shortDescription: "",
            description: "",
            fileKey: "",
            price: 0,
            duration: 0,
            level: "Beginner",
            category: "Information Technology",
            status: "Draft",
            slug: "",
        },
    })
    
    function onSubmit(values: CourseSchemaType) {

        startTransition(async () => {
            const {data: result, error} = await tryCatch(CreateNewCourse(values));
            
            if(error) {
                toast.error("An expected error occured. Please try again.");
                return;
            }

            if(result.status === "success") {
                toast.success(result.message);
                triggerConfetti();
                form.reset();
                router.push("/admin/courses");
            } else if (result.status === "error") {
                toast.error(result.message);
            }
        })
    }

  return (
    <>
        <div className="px-4 lg:px-6">
            <div className="flex items-center gap-4 mb-6">
                <Link 
                className={buttonVariants({ variant: "outline", size: "icon" })}
                href="/admin/courses">
                    <Undo2 className="size-4"/>
                </Link>
                <h1 className="text-2xl font-semibold">Create Course</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Course Information</CardTitle>
                    <CardDescription>
                        Provide the necessary details for the new course you want to add.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6">
                            <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Course Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} 
                            />
                            <div className="flex items-end gap-4">
                                <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Slug" {...field} readOnly/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} 
                                />
                                <Button type="button" className="w-fit" onClick={() => {
                                    const title = form.getValues("title");
                                    const slug = generateSlug(title);

                                    form.setValue("slug", slug, { shouldValidate: true });
                                }}>
                                    <SparkleIcon className="size-5" /> Generate Slug 
                                </Button>
                            </div>
                            <FormField
                                control={form.control}
                                name="shortDescription"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Short Description</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                            placeholder="Short description"
                                            className="min-h-[120px]" 
                                            {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} 
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Editor field={field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} 
                            />
                            <FormField
                                control={form.control}
                                name="fileKey"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Thumbnail</FormLabel>
                                        <FormControl>
                                            <FileUploader onChange={field.onChange} value={field.value} fileTypeRequired="image" />
                                        </FormControl> 
                                        <FormMessage />
                                    </FormItem>
                                )} 
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                                <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Category</FormLabel>
                                        <Select 
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger> 
                                            </FormControl>
                                            <SelectContent>
                                                {courseCategories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )} 
                                />
                                <FormField
                                control={form.control}
                                name="level"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Level</FormLabel>
                                        <Select 
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger> 
                                            </FormControl>
                                            <SelectContent>
                                                {courseLevels.map((level) => (
                                                    <SelectItem key={level} value={level}>
                                                        {level}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )} 
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Duration (Hours)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )} 
                                />
                                <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Price (₱)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )} 
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Status</FormLabel>
                                        <Select 
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger> 
                                            </FormControl>
                                            <SelectContent>
                                                {courseStatus.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} 
                            />
                            <div className="flex items-center justify-center">
                                <Button 
                                type="submit"
                                disabled={isPending} 
                                className="w-full sm:w-fit"> 
                                    {isPending ? (
                                        <>
                                            <Loader2 className="size-5 animate-spin ml-1" /> Saving 
                                        </>
                                    ):(
                                        <>
                                            <Save className="mr-1 size-5" /> Save Course 
                                        </>
                                    )}
                                </Button>
                            </div>                         
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div> 
    </>
  )
}

export default CreateCourse;