import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { chapterSchema, ChapterSchemaType } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CirclePlusIcon, Loader2 } from "lucide-react";
import React, { useState, useTransition } from "react"
import { useForm } from "react-hook-form";
import { createChapter } from "../actions";
import { toast } from "sonner";

const ChapterModal = ({courseId}: {courseId: string}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<ChapterSchemaType>({
        resolver: zodResolver(chapterSchema),
        defaultValues: {
            name: "",
            courseId: courseId
        },
    })
    
    async function onSubmit (values: ChapterSchemaType) {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(createChapter(values));

            if(error) {
                toast.error("An error occurred while creating chapter. Please try again.")
                return;
            }

            if (result.status === "success") {
                toast.success(result.message);
                form.reset();
                setIsOpen(false);
            } else if(result.status === "error") {
                toast.error(result.message);
            }
        })
    }

    function dialogHandler(open: boolean) {

        if(!open) {
            form.reset();
        }
        
        setIsOpen(open);
    }

  return (
    <Dialog open={isOpen} onOpenChange={dialogHandler}>
        <DialogTrigger asChild>
            <Button className="gap-2">
                <CirclePlusIcon className="size-5" /> Add Chapter
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Add New Chapter</DialogTitle>
                <DialogDescription className="text-muted-foreground">Add a chapter to group related lessons together.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField 
                        control={form.control} 
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Chapter name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button disabled={isPending} type="submit" className="w-full">
                            {isPending ? (
                                <> <Loader2 className="size-5 animate-spin" /> Adding  </>
                            ):(
                                <> Add Chapter </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default ChapterModal;