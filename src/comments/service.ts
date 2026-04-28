import type { CreateCommentInput, UpdateCommentInput } from "../schema.js";
import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { commentsTable } from "../schema.js";

export async function getComments() {
  return db.select().from(commentsTable);
}

export async function getCommentById(id: number) {
  return db.query.commentsTable.findFirst({
    where: eq(commentsTable.id, id),
  });
}

export async function getCommentsByPostId(postId: number) {
  return db.select().from(commentsTable).where(eq(commentsTable.postId, postId));
}

export async function createComment(input: CreateCommentInput) {
  const [comment] = await db.insert(commentsTable).values(input).returning();
  return comment;
}

export async function updateComment(id: number, input: UpdateCommentInput) {
  const values = removeUndefined(input);

  if (Object.keys(values).length === 0) {
    return getCommentById(id);
  }

  const [comment] = await db
    .update(commentsTable)
    .set(values)
    .where(eq(commentsTable.id, id))
    .returning();

  return comment;
}

export async function deleteComment(id: number) {
  const [comment] = await db
    .delete(commentsTable)
    .where(eq(commentsTable.id, id))
    .returning();

  return comment;
}

function removeUndefined(input: UpdateCommentInput): UpdateCommentInput {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as UpdateCommentInput;
}
