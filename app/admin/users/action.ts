"use server";

import { requireAdmin } from "@/app/data/admin/admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { apiResponse } from "@/lib/types";
import { request } from "@arcjet/next";

// Arcjet rate limit rule
const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

/**
 * Runs Arcjet rate limit protection for an admin session.
 */
async function checkRateLimit(userId: string): Promise<apiResponse | null> {
  const req = await request();
  const decision = await aj.protect(req, { fingerprint: userId });

  if (decision.isDenied()) {
    return {
      status: "error",
      message: decision.reason.isRateLimit()
        ? "You've reached the maximum number of allowed requests."
        : "Access blocked due to potentially unsafe behavior.",
    };
  }

  return null;
}

export async function updateUserRole(
  userId: string,
  newRole: "user" | "admin"
): Promise<apiResponse> {
  const session = await requireAdmin();

  try {
    // Apply rate limiting
    const limitResult = await checkRateLimit(session.user.id);
    if (limitResult) return limitResult;

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return { status: "success", message: "User role updated successfully." };
  } catch (err: unknown) {
    let message = "User not found or update failed.";
    if (err instanceof Error) message = err.message;
    return {
      status: "error",
      message,
    };
  }
}

export async function deleteUser(userId: string): Promise<apiResponse> {
  const session = await requireAdmin();

  try {
    // Apply rate limiting
    const limitResult = await checkRateLimit(session.user.id);
    if (limitResult) return limitResult;

    await prisma.user.delete({
      where: { id: userId },
    });

    return { status: "success", message: "User deleted successfully." };
  } catch (err: unknown) {
    let message = "User not found or deletion failed.";
    if (err instanceof Error) message = err.message;
    return {
      status: "error",
      message,
    };
  }
}
