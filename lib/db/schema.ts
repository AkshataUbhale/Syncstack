import {
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";
import { fileURLToPath } from "url";

export const file = pgTable("file", {
  id: uuid("id").defaultRandom().primaryKey(),

  //Basic file and folder formation
  name: text("name").notNull(),
  path: text("path").notNull(), // something like /documents/project/file.txt
  size: integer("size").notNull(),
  type: text("type").notNull(), // file or folder

  //storage information
  fileURL: text("file_URL").notNull(), //URL to access the file
  thumbnailURL: text("thumbnail_URL"), //URL to access the thumbnail

  //Ownership
  userID: text("user_ID").notNull(),
  parentID: text("parent_ID"), //ID of the parent folder null for root.

  //file/folder flags
  isFolder: boolean("is_folder").notNull().default(false),
  isShared: boolean("is_shared").notNull().default(false),
  isStared: boolean("is_stared").notNull().default(false),
  isTrashed: boolean("is_trashed").notNull().default(false),
  isDeleted: boolean("is_deleted").notNull().default(false),

  //timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdateFn(() => new Date()).notNull(),
});
/*Parent : each file can have one parent folder
Children : each folder can have many children files/folders
*/
export const fileRelations = relations(file, ({ one, many }) => ({
  parent: one(file, {
    fields: [file.parentID],
    references: [file.id],
  }),
  children: many(file),
}));

// type definitions
export type File = typeof file.$inferSelect;
export type NewFile = typeof file.$inferInsert;