"use client"

import { LessonType } from "@/app/data/admin/admin-manage-lesson"
import Editor from "@/components/tiptap/Editor"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import FileUploader from "@/components/Uploader"
import { lessonSchema, LessonSchemaType } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save, Undo2 } from "lucide-react"
import Link from "next/link"
import React, { useTransition } from "react"
import { useForm } from "react-hook-form"
import { ConfigureLesson } from "../actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { tryCatch } from "@/hooks/try-catch"

interface LessonProps {
  data: LessonType
  chapterId: string
  courseId: string
}

const LessonForm = ({ chapterId, data, courseId }: LessonProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: data.title,
      chapterId: chapterId,
      courseId: courseId,
      description: data.description ?? undefined,
      thumbnailKey: data.thumbnailKey ?? undefined,
      videoKey: data.videoKey ?? undefined,
    },
    mode: "onChange",
  })

  function onSubmit(values: LessonSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        ConfigureLesson(data.id, values)
      )

      if (error) {
        toast.error("An unexpected error occurred. Please try again.")
        return
      }

      if (result.status === "success") {
        toast.success(result.message)
        form.reset(values)
        router.push(`/admin/courses/${courseId}/edit`)
      } else if (result.status === "error") {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          className={buttonVariants({ variant: "outline", size: "icon" })}
          href={`/admin/courses/${courseId}/edit`}
        >
          <Undo2 className="size-5" />
        </Link>
        <h1 className="text-2xl font-semibold">Lesson Configuration</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lesson Setup</CardTitle>
          <CardDescription>
            Organize and structure your lesson content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Lesson name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
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
                name="thumbnailKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Image</FormLabel>
                    <FormControl>
                      <FileUploader
                        onChange={field.onChange}
                        value={field.value}
                        fileTypeRequired="image"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="videoKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video File</FormLabel>
                    <FormControl>
                      <FileUploader
                        onChange={field.onChange}
                        value={field.value}
                        fileTypeRequired="video"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-center">
                <Button
                  type="submit"
                  disabled={isPending || !form.formState.isDirty}
                  className="w-full sm:w-fit"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-5 animate-spin ml-1" /> Saving
                    </>
                  ) : (
                    <>
                      <Save className="mr-1 size-5" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LessonForm