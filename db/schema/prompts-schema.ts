import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Schema for the prompts table
 *
 * Fields:
 * - id: Auto-incrementing primary key
 * - user_id: User ID from Clerk (defaults to 'legacy' for existing records)
 * - name: Name of the prompt
 * - description: Short description of what the prompt does
 * - content: The actual prompt text
 * - created_at: Timestamp of when the prompt was created
 * - updated_at: Timestamp of when the prompt was last updated (automatically updates)
 */

export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().default("legacy"),
  name: text("name").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
});

export type InsertPrompt = typeof prompts.$inferInsert;
export type SelectPrompt = typeof prompts.$inferSelect;
