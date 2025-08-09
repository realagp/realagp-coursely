import "server-only";

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";


export async function getCourse (slug:string) {
    const data = await prisma.course.findUnique({
        where: {
            slug: slug,
        },
        select: {
            id: true,
            title: true,
            price: true,
            description: true,
            shortDescription: true,
            fileKey: true,
            level: true,
            duration: true,
            category: true,
            chapter: {
                select: {
                    id: true,
                    title: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                        },
                        orderBy: {
                            position: "asc"
                        }
                    }
                },
                orderBy: {
                    position: "asc",
                }, 
            }
        },
    })

    if(!data) {
        return notFound();
    }

    return data;
}