"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, PencilLine, } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { chapterSchema, ChapterSchemaType } from "@/lib/validations";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { updateChapter } from "../actions";

interface ChapterEditModalProps {
  chapterId: string;
  initialName: string;
  courseId: string;
}

const ChapterEditModal = ({
  chapterId,
  initialName,
  courseId,
}: ChapterEditModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChapterSchemaType>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      name: initialName,
      courseId,
    },
  });

  const currentName = form.watch("name");
  const isUnchanged = currentName.trim() === initialName.trim();

  async function onSubmit(values: ChapterSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateChapter({
          chapterId,
          name: values.name,
          courseId,
        })
      );

      if (error) {
        toast.error("An error occurred while updating the chapter.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        form.reset(values); // reset with current name
        setIsOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  function dialogHandler(open: boolean) {
    if (!open) {
      form.reset({
        name: initialName,
        courseId,
      });
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={dialogHandler}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="gap-1">
          <PencilLine className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Chapter</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update the chapter title.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chapter Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Chapter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                disabled={isPending || isUnchanged}
                type="submit"
                className="w-full"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-5 animate-spin" /> Updating
                  </>
                ) : (
                  <> Update </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChapterEditModal;
