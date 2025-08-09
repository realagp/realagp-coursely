"use client"

import { Button } from "@/components/ui/button"
import { tryCatch } from "@/hooks/try-catch";
import { Loader2 } from "lucide-react";
import { useTransition } from "react"
import { toast } from "sonner";
import { enrollmentProcess } from "../action";

const EnrollButton = ({courseId}:{courseId: string}) => {

    const [isPending, startTransition] = useTransition();

    function onSubmit() {

        startTransition(async () => {
            const {data: result, error} = await tryCatch(enrollmentProcess(courseId));
            
            if(error) {
                toast.error("An expected error occured. Please try again.");
                return;
            }

            if(result.status === "success") {
                toast.success(result.message);
            } else if (result.status === "error") {
                toast.error(result.message);
            }
        })
    }

  return (
    <Button
    onClick={onSubmit} 
    disabled={isPending} 
    className="w-full rounded">
        {isPending ? (
            <> <Loader2 className="size-5 animate-spin" /> Processing </>
        ):(
            <> Enroll Now! </>
        )}
    </Button>
  )
}

export default EnrollButton;