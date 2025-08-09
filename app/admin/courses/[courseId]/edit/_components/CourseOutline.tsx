"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DndContext, 
  DragEndEvent, 
  DraggableSyntheticListeners, 
  KeyboardSensor, 
  PointerSensor, 
  rectIntersection, 
  useSensor, 
  useSensors } from "@dnd-kit/core";
import { 
  arrayMove,
  SortableContext, 
  sortableKeyboardCoordinates, 
  useSortable, 
  verticalListSortingStrategy } from "@dnd-kit/sortable";
import React, { ReactNode, useEffect, useState } from "react";
import {CSS} from '@dnd-kit/utilities';
import { CourseDataType } from "@/app/data/admin/admin-manage-course";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, FileText, Grip  } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { reorderChapterLessons, reorderCourseChapters } from "../actions";
import ChapterModal from "./ChapterModal";
import LessonModal from "./LessonModal";
import DeleteLesson from "./DeleteLesson";
import DeleteChapter from "./DeleteChapter";
import EmptyFileState from "../../../../../../components/EmptyFileState";
import ChapterEditModal from "./EditChapterModal";

interface CourseProps {
  data: CourseDataType; 
}

interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string;
  }
} 

const CourseOutline = ({data}: CourseProps) => {

  const initialItems = data.chapter.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    order: chapter.position,
    isOpen: true,
    lessons: chapter.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      order: lesson.position
    }))
  })) || [];

  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems((prevItems) => {
      const updatedItems = data.chapter.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen: prevItems.find((item) => item.id === chapter.id)?.isOpen ?? true,
        lessons: chapter.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          order: lesson.position
        })),       
      })) || [];

      return updatedItems;
    })
  }, [data])

  function SortableItem({children, id, className, data}: SortableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({id: id, data: data});
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
  
    return (
      <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
      className={cn("touch-none", className, isDragging ? "z-10" : "")}>
        {children(listeners)}
      </div>
    );
  }


  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = over.data.current?.type as "chapter" | "lesson";
    const courseId = data.id;

    if(activeType === "chapter") {
      let targetChapterId = null;

      if(overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chapterId ?? null;
      }

      if(!targetChapterId) {
        toast.error("Oops! A chapter can’t go inside another chapter.")
        return;
      }

      const prevChapterPosition = items.findIndex((item) => item.id === activeId)
      const newChapterPosition = items.findIndex((item) => item.id === targetChapterId)

      if(prevChapterPosition ===-1 || newChapterPosition === -1) {
        toast.error("Oops! Something went wrong while ordering chapters.")
        return; 
      }

      const reorderChapter = arrayMove(items, prevChapterPosition, newChapterPosition);

      const updatedChapterOrder = reorderChapter.map((chapter, position) =>({
        ...chapter,
        order: position + 1,
      }))

      const prevItems = [...items];
      setItems(updatedChapterOrder);

      if(courseId) {
        const activeChapters = updatedChapterOrder.map((chapter) => ({
          id: chapter.id,
          position: chapter.order,
        }))

        const reorderChaptersProcess = () => reorderCourseChapters(courseId, activeChapters);

        toast.promise(reorderChaptersProcess(),{
          loading: "Reordering chapters...",
          success: (result) => {
            if(result.status === "success") return result.message;
            throw new Error(result.message)
          },
          error: () => {
            setItems(prevItems);
            return "Failed to reorder chapters. Please try again.";
          }
        }) 
      }

      return;

    }

    if(activeType === "lesson" && overType === "lesson") {
      const chapterId = active.data.current?.chapterId;
      const overChapterId = over.data.current?.chapterId;

      if(!chapterId || chapterId !== overChapterId) {
        toast.error("Oops! That’s not a valid chapter for this lesson.");
        return;
      }

      const chapterPosition = items.findIndex((chapter) => chapter.id === chapterId)

      if(chapterPosition === -1) {
        toast.error("Oops! No chapter found.");
        return;
      }

      const activeChapter = items[chapterPosition];

      const prevLessonPosition = activeChapter.lessons.findIndex((lesson) => lesson.id === activeId);
      const newLessonPosition = activeChapter.lessons.findIndex((lesson) => lesson.id === overId);

      if(prevLessonPosition ===-1 || newLessonPosition === -1) {
        toast.error("Oops! Something went wrong while ordering lessons.")
        return; 
      }      

      const reorderLessons = arrayMove(activeChapter.lessons, prevLessonPosition, newLessonPosition);

      const updatedLessonsOrder = reorderLessons.map((lesson, position) =>({
        ...lesson,
        order: position + 1,
      }))
 
      const newItems = [...items];
      
      newItems[chapterPosition] = {
        ...activeChapter,
        lessons: updatedLessonsOrder,
      }

      const prevItems = [...items];
      
      setItems(newItems);

      if(courseId) {
        const activeLessons = updatedLessonsOrder.map((lesson) => ({
          id: lesson.id,
          position: lesson.order,
        }))

        const reorderLessonsProcess = () => reorderChapterLessons(chapterId, activeLessons, courseId);

        toast.promise(reorderLessonsProcess(),{
          loading: "Reordering lessons...",
          success: (result) => {
            if(result.status === "success") return result.message;
            throw new Error(result.message)
          },
          error: () => {
            setItems(prevItems);
            return "Failed to reorder lessons . Please try again.";
          }
        }) 
      }

      return;
    }
  }

  function toggleChapter(chapterId: string) {
    setItems(items.map((chapter) => chapter.id === chapterId 
        ? {...chapter, isOpen: !chapter.isOpen} 
        : chapter
      )
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext 
    collisionDetection={rectIntersection} 
    onDragEnd={handleDragEnd}
    sensors={sensors}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
            <CardTitle>Chapters</CardTitle>
            <ChapterModal courseId={data.id}/>
        </CardHeader>
        <CardContent className="space-y-7">
          {data.chapter.length === 0 ? (
            <EmptyFileState 
            title="Empty Course Outline" 
            description="You’re just one chapter away from getting started. Add your first one now!"
            />
          ):(
          <SortableContext
          items={items} 
          strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableItem id={item.id} data={{type: "chapter"}} key={item.id}>
                {(listeners) => (
                  <Card>
                    <Collapsible 
                    open={item.isOpen} 
                    onOpenChange={() => toggleChapter(item.id)}>
                      <div className="flex items-center justify-between p-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" {...listeners} className="cursor-grabbing">
                            <Grip className="size-5 text-muted-foreground"/>
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button size="icon" variant="ghost" className="flex items-center cursor-pointer">
                              {item.isOpen ? (
                                <ChevronDown className="size-5 text-muted-foreground"/>
                              ):(
                                <ChevronRight className="size-5 text-muted-foreground"/>
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="hover:text-primary pl-2">{item.title}</p>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <ChapterEditModal
                            chapterId={item.id}
                            initialName={item.title}
                            courseId={data.id}
                          />                                    
                          <DeleteChapter chapterId={item.id} courseId={data.id} />
                        </div>
                      </div>
                      <CollapsibleContent>
                        <div className="p-1">
                          {item.lessons.length === 0 ? (
                            <EmptyFileState 
                            title="All Quiet Here.." 
                            description="There are no lessons in this chapter just yet. Time to fill it up!"
                            />                            
                          ):(
                          <SortableContext 
                          items={item.lessons.map((lesson) => lesson.id)}
                          strategy={verticalListSortingStrategy}>
                            {item.lessons.map((lesson) =>(
                              <SortableItem 
                              key={lesson.id}
                              id={lesson.id}
                              data={{type: "lesson", chapterId: item.id}}>
                                {(lessonListeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md">
                                    <div className="flex items-center gap-2">
                                      <Button size="icon" variant="ghost" {...lessonListeners} className="cursor-grabbing">
                                        <Grip className="size-4 text-muted-foreground"/>
                                      </Button>
                                      <FileText className="size-4"/>
                                      <Link href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}>
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    <DeleteLesson chapterId={item.id} courseId={data.id} lessonId={lesson.id} />
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          )}
                          <div className="p-2">
                            <LessonModal courseId={data.id} chapterId={item.id} />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
          )}
        </CardContent>
      </Card>
    </DndContext>
  )
}

export default CourseOutline;