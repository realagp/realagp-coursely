import "server-only";

import { prisma } from "@/lib/db";


export async function getAllCourses (page = 1, limit = 4) {
  const [data, total] = await Promise.all([
    prisma.course.findMany({
      where: {
        status: "Published",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        price: true,
        shortDescription: true,
        slug: true,
        fileKey: true,
        level: true,
        duration: true,
        category: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.course.count({
      where: {
        status: "Published",
      },
    }),
  ]);

  return {
    data,
    total,
  };
}

export type PublicPaginatedCourseType = Awaited<ReturnType<typeof getAllCourses>>["data"][0];