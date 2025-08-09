import "server-only";

import { verifiedUser } from "./verified-user";
import { prisma } from "@/lib/db";

export async function getActiveCourses(page = 1, limit = 4) {
  const user = await verifiedUser();

  const [data, total] = await Promise.all([
    prisma.enrollment.findMany({
      where: {
        userId: user.id,
        status: "Active",
      },
      select: {
        Course: {
          select: {
            id: true,
            shortDescription: true,
            title: true,
            fileKey: true,
            level: true,
            slug: true,
            duration: true,
            category: true,
            price: true,
            chapter: {
              select: {
                id: true,
                lessons: {
                  select: {
                    id: true,
                    lessonProgress: {
                      where: {
                        userId: user.id,
                      },
                      select: {
                        id: true,
                        completed: true,
                        lessonId: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.enrollment.count({
      where: {
        userId: user.id,
        status: "Active",
      },
    }),
  ]);

  return {
    data,
    total,
  };
}

export type ActiveCoursesType = Awaited<ReturnType<typeof getActiveCourses>>["data"][0];
