"use server";

import { db } from "@/db";
import { prompts } from "@/db/schema/prompts-schema";
import { devDelay } from "@/lib/dev-delay";
import { and, desc, eq } from "drizzle-orm";
import { requireUserId } from "./auth-actions";

/**
 * Fetches all prompts from the database for the current user
 * Returns prompts sorted by creation date (newest first)
 */
export async function getPrompts() {
  try {
    const userId = await requireUserId();

    // Add artificial delay in development
    await devDelay();

    // Query prompts for the current user only
    return await db.select().from(prompts).where(eq(prompts.user_id, userId)).orderBy(desc(prompts.created_at));
  } catch (error) {
    console.error("Error fetching prompts:", error);
    throw new Error("Failed to fetch prompts");
  }
}

/**
 * Creates a new prompt in the database
 * @param name - The name of the prompt
 * @param description - A short description of what the prompt does
 * @param content - The actual prompt text
 * @returns The newly created prompt
 */
export async function createPrompt({ name, description, content }: { name: string; description: string; content: string }) {
  try {
    const userId = await requireUserId();

    // Add artificial delay in development
    await devDelay();

    // Insert the new prompt with the user ID
    const [newPrompt] = await db
      .insert(prompts)
      .values({
        name,
        description,
        content,
        user_id: userId
      })
      .returning();

    return newPrompt;
  } catch (error) {
    console.error("Error creating prompt:", error);
    throw new Error("Failed to create prompt");
  }
}

/**
 * Updates an existing prompt in the database
 * @param id - The ID of the prompt to update
 * @param name - The new name of the prompt
 * @param description - The new description of the prompt
 * @param content - The new content of the prompt
 * @returns The updated prompt
 */
export async function updatePrompt({ id, name, description, content }: { id: number; name: string; description: string; content: string }) {
  try {
    const userId = await requireUserId();

    // Add artificial delay in development
    await devDelay();

    // Update the prompt only if it belongs to the current user
    const [updatedPrompt] = await db
      .update(prompts)
      .set({
        name,
        description,
        content,
        updated_at: new Date()
      })
      .where(and(eq(prompts.id, id), eq(prompts.user_id, userId)))
      .returning();

    if (!updatedPrompt) {
      throw new Error("Prompt not found");
    }

    return updatedPrompt;
  } catch (error) {
    console.error("Error updating prompt:", error);
    throw new Error("Failed to update prompt");
  }
}

/**
 * Deletes a prompt from the database
 * @param id - The ID of the prompt to delete
 * @returns The deleted prompt
 */
export async function deletePrompt(id: number) {
  try {
    const userId = await requireUserId();

    // Add artificial delay in development
    await devDelay();

    // Delete the prompt only if it belongs to the current user
    const [deletedPrompt] = await db
      .delete(prompts)
      .where(and(eq(prompts.id, id), eq(prompts.user_id, userId)))
      .returning();

    if (!deletedPrompt) {
      throw new Error("Prompt not found");
    }

    return deletedPrompt;
  } catch (error) {
    console.error("Error deleting prompt:", error);
    throw new Error("Failed to delete prompt");
  }
}
