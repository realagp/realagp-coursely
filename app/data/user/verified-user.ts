import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/db";

export const verifiedUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  const { user } = session;

  // Ensure the user exists in your DB
  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    update: {}, // Nothing to update
    create: {
      id: user.id,
      name: user.name || "Unnamed",
      email: user.email || "",
      emailVerified: false,
      image: user.image || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return dbUser;
});
