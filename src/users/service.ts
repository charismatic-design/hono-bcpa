import type { CreateUserInput, UpdateUserInput } from "../schema.js";
import { and, eq, ne } from "drizzle-orm";
import { db } from "../db.js";
import { getPostsByUserId } from "../post/service.js";
import { usersTable } from "../schema.js";

export async function getUsers() {
  return db.select().from(usersTable);
}

export async function getUsersById(id: number) {
  return db.query.usersTable.findFirst({
    where: eq(usersTable.id, id),
  });
}

export async function getPostsForUser(id: number) {
  return getPostsByUserId(id);
}

export async function createUser(input: CreateUserInput) {
  const [user] = await db.insert(usersTable).values(input).returning();
  return user;
}

export async function updateUser(id: number, input: UpdateUserInput) {
  const values = removeUndefined(input);

  if (Object.keys(values).length === 0) {
    return getUsersById(id);
  }

  const [user] = await db
    .update(usersTable)
    .set(values)
    .where(eq(usersTable.id, id))
    .returning();

  return user;
}

export async function deleteUser(id: number) {
  const [user] = await db
    .delete(usersTable)
    .where(eq(usersTable.id, id))
    .returning();

  return user;
}

export async function emailExists(email: string, ignoredUserId?: number) {
  const where =
    ignoredUserId === undefined
      ? eq(usersTable.email, email)
      : and(eq(usersTable.email, email), ne(usersTable.id, ignoredUserId));

  const user = await db.query.usersTable.findFirst({ where });
  return Boolean(user);
}

function removeUndefined(input: UpdateUserInput): UpdateUserInput {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as UpdateUserInput;
}
