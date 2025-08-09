import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./admin";

export async function getArchivedCourses(page = 1, limit = 4) {
  await requireAdmin();

  const [data, total] = await Promise.all([
    prisma.course.findMany({
      where: {
        status: "Archived"
      },
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
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.course.count({
      where: {
        status: "Archived"
      }
    })
  ]);

  return {
    data,
    total
  };
}

export type AdminCourseType = Awaited<ReturnType<typeof getArchivedCourses>>["data"][0];
