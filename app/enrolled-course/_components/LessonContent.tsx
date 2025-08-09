"use client"

import { GetLessonType } from "@/app/data/course/get-lesson"
import RenderDescription from "@/components/tiptap/RenderDescription"
import { Button } from "@/components/ui/button"
import { ConstructedUrl } from "@/hooks/object-url"
import { tryCatch } from "@/hooks/try-catch"
import { CheckCircle, Loader2, VideoOff } from "lucide-react"
import React, { useTransition } from "react"
import { toast } from "sonner"
import { useConfetti } from "@/hooks/confetti"
import { markLessonDone } from "../[slug]/[lessonId]/action"

interface LessonContentProps {
    data: GetLessonType,
}

const LessonContent = ({data}: LessonContentProps) => {

    const [isPending, startTransition] = useTransition();
    const {triggerConfetti} = useConfetti();

    function VideoPlayer({thumbnailKey, videoKey}:{thumbnailKey: string, videoKey: string}) {

        const videoUrl = ConstructedUrl(videoKey);
        const thumbnailUrl = ConstructedUrl(thumbnailKey);

        if(!videoKey) {
            return (
                <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
                    <div className="flex size-16 rounded-full items-center justify-center bg-destructive/10 mx-auto mb-4">
                        <VideoOff className="size-8 text-destructive" />
                    </div>
                    <p className="text-muted-foreground">No video available for this lesson yet.</p>
                </div> 
            )
        }

        return (
            <div className="aspect-video rounded-lg bg-background relative overflow-hidden">
                <video 
                src={videoUrl}
                controls
                poster={thumbnailUrl} 
                className="w-full h-full object-cover "/>
            </div>
        )
    }

    function onSubmit() {

        startTransition(async () => {
            const {data: result, error} = await tryCatch(markLessonDone(data.id, data.Chapter.Course.slug));
            
            if(error) {
                toast.error("An expected error occured. Please try again.");
                return;
            }

            if(result.status === "success") {
                toast.success(result.message);
                triggerConfetti();
            } else if (result.status === "error") {
                toast.error(result.message);
            }
        })
    }    

  return (
    <div className="flex flex-col h-full bg-background">
        <VideoPlayer thumbnailKey={data.thumbnailKey ?? ""} videoKey={data.videoKey ?? ""} />
        <div className="py-4 border-b">
            {data.lessonProgress.length > 0 ? (
                <Button 
                variant="outline" className="text-green-500 hover:text-green-500">
                    <CheckCircle className="size-5 text-green-500" />
                    Done
                </Button>
            ):(
                <Button 
                variant="outline"
                disabled={isPending} 
                onClick={onSubmit}>
                    {isPending ? (
                        <>
                            <Loader2 className="size-5 animate-spin" />
                            Updating                      
                        </>
                    ):(
                        <>
                            <CheckCircle className="size-5" />
                            Mark as Done                        
                        </>                    
                    )}
                </Button>
            )}
        </div>
        <div className="pt-4 space-y-4">
            <h1 className="text-2xl text-primary font-semibold tracking-tight truncate">{data.title}</h1>
            {data.description && (
                <RenderDescription json={JSON.parse(data.description)} />
            )}
        </div>
    </div>
  )
}

export default LessonContent