import { 
    AlertDialog, 
    AlertDialogCancel, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle,
    AlertDialogContent,
    AlertDialogDescription, 
    AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Loader2, Trash2 } from "lucide-react";
import React, { useState, useTransition } from "react"
import { toast } from "sonner";
import { deleteLesson } from "../actions";

const DeleteLesson = ({
    chapterId, 
    courseId, 
    lessonId}:{
        chapterId: string, 
        courseId: string, 
        lessonId: string,
    }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    async function onSubmit () {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(deleteLesson({chapterId, courseId, lessonId}));

            if(error) {
                toast.error("An error occurred while deleting lesson. Please try again.")
                return;
            }

            if (result.status === "success") {
                toast.success(result.message);
                setIsOpen(false);
            } else if(result.status === "error") {
                toast.error(result.message);
            }
        })
    }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
            <Button size="icon" variant="ghost" className="cursor-pointer">
                <Trash2 className="size-4 text-destructive"/>
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-[425px]">
            <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                    You’re about to permanently remove this lesson. This can’t be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button 
                type="button" 
                variant="destructive"
                disabled={isPending} 
                onClick={onSubmit}>
                    {isPending ? (
                        <><Loader2 className="size-5 animate-spin ml-1"/> Deleting </>
                    ):(
                        <> Confirm </>
                    )}
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteLesson;