"use server";

import { auth } from "@clerk/nextjs/server";

/**
 * Gets the current user's ID or throws if not authenticated
 * @returns The authenticated user's ID
 * @throws Error if no authenticated user is found
 */
export async function requireUserId() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized: No user ID found");
  }

  return userId;
}
