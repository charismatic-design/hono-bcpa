import type { CreatePostInput, UpdatePostInput } from "../schema.js";
import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { postsTable } from "../schema.js";

export async function getPosts() {
  return db.select().from(postsTable);
}

export async function getPostById(id: number) {
  return db.query.postsTable.findFirst({
    where: eq(postsTable.id, id),
  });
}

export async function getPostsByUserId(userId: number) {
  return db.select().from(postsTable).where(eq(postsTable.userId, userId));
}

export async function createPost(input: CreatePostInput) {
  const [post] = await db.insert(postsTable).values(input).returning();
  return post;
}

export async function updatePost(id: number, input: UpdatePostInput) {
  const values = removeUndefined(input);

  if (Object.keys(values).length === 0) {
    return getPostById(id);
  }

  const [post] = await db
    .update(postsTable)
    .set(values)
    .where(eq(postsTable.id, id))
    .returning();

  return post;
}

export async function deletePost(id: number) {
  const [post] = await db
    .delete(postsTable)
    .where(eq(postsTable.id, id))
    .returning();

  return post;
}

function removeUndefined(input: UpdatePostInput): UpdatePostInput {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as UpdatePostInput;
}
