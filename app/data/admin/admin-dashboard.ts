import "server-only";

import { requireAdmin } from "./admin";
import { prisma } from "@/lib/db";

export async function adminDashboardStats() {

    await requireAdmin();

    const [totalUsers, totalCustomers, totalCourses, totalLessons] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
            where:{
                enrollment: {
                    some: {},
                }
            }
        }),
        prisma.course.count(),
        prisma.lesson.count(),
    ])

    return {
        totalUsers, 
        totalCustomers, 
        totalCourses, 
        totalLessons,
    }
}