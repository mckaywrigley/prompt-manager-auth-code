import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { prompts } from "./prompts-schema";

/**
 * Schema for the folders table - Teaching One-to-Many Relationships
 *
 * Key Concepts:
 * 1. One-to-Many: A folder can contain many prompts, but a prompt can only be in one folder
 * 2. Primary Key: The 'id' field uniquely identifies each folder
 * 3. This is the "One" side of the One-to-Many relationship
 *
 * Fields:
 * - id: Auto-incrementing primary key (unique identifier for each folder)
 * - user_id: Links the folder to a specific user (from Clerk auth)
 * - name: Name of the folder (e.g., "Work Prompts", "Creative Writing")
 * - created_at: When the folder was created
 * - updated_at: When the folder was last modified
 *
 * Relationship Note:
 * - Prompts will reference this table using a folder_id foreign key
 * - This creates the One-to-Many relationship where ONE folder can have MANY prompts
 */
export const folders = pgTable("folders", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull(),
  name: text("name").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
});

export const foldersRelations = relations(folders, ({ many }) => ({
  prompts: many(prompts)
}));

export type InsertFolder = typeof folders.$inferInsert;
export type SelectFolder = typeof folders.$inferSelect;
