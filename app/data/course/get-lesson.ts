import "server-only";

import { prisma } from "@/lib/db";
import { verifiedUser } from "../user/verified-user";
import { notFound } from "next/navigation";


export async function getLesson (lessonId: string) {

    const session =  await verifiedUser();

    const lesson = await prisma.lesson.findUnique({
        where: {
            id: lessonId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            thumbnailKey: true,
            videoKey: true,
            position: true,
            lessonProgress: {
                where: {
                    userId: session.id
                },
                select: {
                    completed: true,
                    lessonId: true,
                }
            },
            Chapter: {
                select: {
                    courseId: true,
                    Course: {
                        select: {
                            slug: true,
                            title: true,
                        }
                    }
                }
            }

        }
    })

    if(!lesson) {
        return notFound();
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId:{
                userId: session.id,
                courseId: lesson.Chapter.courseId
            } 
        },
        select: {
            status: true,
        }
    })

    if(!enrollment || enrollment.status !== "Active") {
        return notFound();
    }

    return lesson;
}

export type GetLessonType = Awaited<ReturnType<typeof getLesson>>;
