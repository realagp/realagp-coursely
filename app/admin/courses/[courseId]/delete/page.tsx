"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import { Loader2, Trash2, TriangleAlertIcon, Undo2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteCourse } from "./actions";
import { Input } from "@/components/ui/input";

const DeleteCourse = () => {

    const [isPending, startTransition] = useTransition();
    const [confirmText, setConfirmText] = useState("");
    const {courseId} = useParams<{courseId:string}>();
    const router = useRouter();

    function onSubmit() {

        startTransition(async () => {
          
            const {data: result, error} = await tryCatch(deleteCourse(courseId));
            
            if(error) {
                toast.error("An expected error occured. Please try again.");
                return;
            }

            if(result.status === "success") {
                toast.success(result.message);
                router.push("/admin/courses")
            } else if (result.status === "error") {
                toast.error(result.message);
            }
        })
    }
    
  return (
    <div className="px-4 lg:px-6 mt-12">
      <div className="max-w-xl mx-auto h-full">
        <Card>
          <CardHeader className="text-center">
            <div className="bg-destructive/10 rounded-full p-2 w-fit mx-auto">
              <TriangleAlertIcon className="size-10 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Confirm Deletion</CardTitle>
            <CardDescription className="text-md mx-auto">
                <p className="mt-2">
                  This will permanently remove the course and all its
                  associated data.
                </p>
                <p>
                  Make sure you really want to delete this course.
                  Typing <em>Confirm</em> prevents accidental deletions.
                </p>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2">
             <Input 
              type="text"
              placeholder='Type "Confirm" to delete'
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-fit"
              />
              <Button
            disabled={isPending || confirmText !== "Confirm"} 
            type="submit"
            onClick={onSubmit} 
            variant="destructive" 
            className="cursor-pointer">
              {isPending ? (
                <> <Loader2 className="size-4 animate-spin" /> Deleting </>
              ):(
                <> <Trash2 className="size-4" /> Delete </>
              )}
            </Button>
            </div>
            <div className="flex items-center justify-center">
            <Link 
            className={buttonVariants({ variant: "outline"})}
            href={`/admin/courses/`}>
              <Undo2 className="size-5" />No, I've changed my mind
            </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DeleteCourse;