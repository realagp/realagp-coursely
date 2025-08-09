"use server"

import { verifiedUser } from "@/app/data/user/verified-user"
import { prisma } from "@/lib/db";
import { apiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function markLessonDone(lessonId: string, slug: string):Promise<apiResponse> {

    const session = await verifiedUser();

    try {

        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: session.id,
                    lessonId: lessonId,
                }
            },
            update: {
                completed: true,
            },
            create: {
                lessonId: lessonId,
                userId: session.id,
                completed: true,
            }
        })

        revalidatePath(`/dashboard/${slug}`)

        return {
            status: "success",
            message: "Progress updated successfully.",
        };           
        
    } catch {
        return {
            status: "error",
            message: "Failed to mark as done. Please check the lesson and try again.",
        };           
    }
}