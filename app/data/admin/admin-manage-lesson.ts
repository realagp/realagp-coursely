import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./admin";
import { notFound } from "next/navigation";

export async function manageLesson(id: string) {

    await requireAdmin();

    const data = await prisma.lesson.findUnique({
        where: { id: id, },
        select: {
            id: true,
            title: true,
            description: true,
            videoKey: true,
            thumbnailKey: true,
            position: true,
        }
    })

    if (!data) {
        return notFound();
    }

    return data;
}

export type LessonType = Awaited<ReturnType<typeof manageLesson>>;