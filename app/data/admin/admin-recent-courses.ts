import "server-only";

import { requireAdmin } from "./admin";
import { prisma } from "@/lib/db";

export async function recentCourses() {

    // await new Promise((resolve) => setTimeout(resolve, 2000))
    
    await requireAdmin();

    const data =  await prisma.course.findMany({
        orderBy: {
            createdAt: "desc"
        },
        take: 2,
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