import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { folders } from "./folders-schema";

/**
 * Schema for the prompts table
 *
 * One-to-Many Relationship Example:
 * - This is the "Many" side of the One-to-Many relationship with folders
 * - Each prompt can belong to ONE folder (through folder_id)
 * - But each folder can contain MANY prompts
 *
 * Fields:
 * - id: Auto-incrementing primary key
 * - user_id: User ID from Clerk (defaults to 'legacy' for existing records)
 * - folder_id: Foreign key reference to the folders table (nullable - prompts can exist without a folder)
 * - name: Name of the prompt
 * - description: Short description of what the prompt does
 * - content: The actual prompt text
 * - created_at: Timestamp of when the prompt was created
 * - updated_at: Timestamp of when the prompt was last updated (automatically updates)
 *
 * Foreign Key Explanation:
 * - folder_id references the id column in the folders table
 * - This creates a constraint ensuring data integrity
 * - We can't add a prompt to a folder that doesn't exist
 * - When a folder is deleted, we need to handle its prompts (set to null or delete)
 */
export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull().default("legacy"),
  folder_id: integer("folder_id").references(() => folders.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
});

export const promptsRelations = relations(prompts, ({ one }) => ({
  folder: one(folders, {
    fields: [prompts.folder_id],
    references: [folders.id]
  })
}));

export type InsertPrompt = typeof prompts.$inferInsert;
export type SelectPrompt = typeof prompts.$inferSelect;
