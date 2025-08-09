import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./admin";

export async function ManageCourses() {
    
    await requireAdmin();
    
    const data = await prisma.course.findMany({
        orderBy: {
            createdAt: "desc"
        },
        select: {
            id: true,
            title: true,
            slug: true,
            fileKey: true,
            shortDescription: true,
            duration: true,
            level: true,
            price: true,
            status: true,
        }
    })

    return data;
}

export type CourseType = Awaited<ReturnType<typeof ManageCourses>>[0];
