import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  email: text("email").notNull().unique(),
});

export const postsTable = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const commentsTable = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  postId: integer("post_id")
    .notNull()
    .references(() => postsTable.id, { onDelete: "cascade" }),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable),
}));

export const postsRelations = relations(postsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [postsTable.userId],
    references: [usersTable.id],
  }),
  comments: many(commentsTable),
}));

export const commentsRelations = relations(commentsTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [commentsTable.postId],
    references: [postsTable.id],
  }),
}));

export type User = typeof usersTable.$inferSelect;
export type CreateUserInput = typeof usersTable.$inferInsert;
export type UpdateUserInput = Partial<Omit<CreateUserInput, "id">>;

export type Post = typeof postsTable.$inferSelect;
export type CreatePostInput = typeof postsTable.$inferInsert;
export type UpdatePostInput = Partial<Omit<CreatePostInput, "id">>;

export type Comment = typeof commentsTable.$inferSelect;
export type CreateCommentInput = typeof commentsTable.$inferInsert;
export type UpdateCommentInput = Partial<Omit<CreateCommentInput, "id">>;
