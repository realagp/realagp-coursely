import "server-only";

import { requireAdmin } from "./admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function manageCourse(id: string) {
    await requireAdmin();

    const data = await prisma.course.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            fileKey: true,
            shortDescription: true,
            description: true,
            duration: true,
            level: true,
            price: true,
            status: true,
            category: true,
            chapter: {
                select: {
                    id: true,
                    title: true,
                    position: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            thumbnailKey: true,
                            videoKey: true,
                            position: true
                        } 
                    }
                },
            }           
        }
    });

    if(!data) {
        return notFound();
    }

    return data;
}

export type CourseDataType = Awaited<ReturnType<typeof manageCourse>>;