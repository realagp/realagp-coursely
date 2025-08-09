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
import { deleteChapter } from "../actions";

const DeleteChapter = ({
    chapterId, 
    courseId}:{
        chapterId: string, 
        courseId: string,
    }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    async function onSubmit () {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(deleteChapter({chapterId, courseId}));

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
            <Button size="icon" variant="outline" className="cursor-pointer">
                <Trash2 className="size-5 text-destructive"/>
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-[425px]">
            <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                    You’re about to permanently remove this chapter. This can’t be undone.
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

export default DeleteChapter;