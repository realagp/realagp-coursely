import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePlusIcon, Loader2, } from 'lucide-react';
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form';
import { lessonSchema, LessonSchemaType } from "@/lib/validations";
import { toast } from 'sonner';
import { tryCatch } from '@/hooks/try-catch';
import { createLesson } from '../actions';

const LessonModal = ({courseId, chapterId}: {courseId: string, chapterId: string}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: "",
            courseId: courseId,
            chapterId: chapterId
        },
    })    

    async function onSubmit (values: LessonSchemaType) {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(createLesson(values));

            if(error) {
                toast.error("An error occurred while creating lesson. Please try again.")
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
            <Button variant="outline" className="w-full">
                <CirclePlusIcon className="mr-1 size-5" /> Add Lesson
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Add New Lesson</DialogTitle>
                <DialogDescription className="text-muted-foreground">Use lessons to deliver key topics within a chapter.</DialogDescription>
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
                                    <Input placeholder="Lesson name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button disabled={isPending} type="submit" className="w-full">
                            {isPending ? (
                                <> <Loader2 className="size-5 animate-spin"/> Adding </>
                            ):(
                                <> Add Lesson </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default LessonModal;