import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { commentsTable, postsTable, usersTable } from "./schema.js";
import * as schema from "./schema.js";

const sqlite = new Database("crud.sqlite");

sqlite.run("PRAGMA foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

const hasBaseSchema =
  tableExists("users") && tableExists("posts") && tableExists("comments");

if (!hasBaseSchema) {
  migrate(db, { migrationsFolder: "drizzle" });
}

const existingUsers = sqlite
  .query<{ count: number }, []>("SELECT COUNT(*) AS count FROM users")
  .get();

if (existingUsers?.count === 0) {
  db.insert(usersTable)
    .values([
      { name: "Neba", age: 21, email: "neba@gmail.com" },
      { name: "Babi", age: 24, email: "babi@gmail.com" },
    ])
    .run();

  db.insert(postsTable)
    .values([
      {
        title: "First post",
        content: "This is the first example post.",
        userId: 1,
      },
      {
        title: "Second post",
        content: "This is another example post.",
        userId: 2,
      },
    ])
    .run();

  db.insert(commentsTable)
    .values([
      { content: "Nice example post.", postId: 1 },
      {
        content: "CRUD APIs are easier to see with sample data.",
        postId: 2,
      },
    ])
    .run();
}

function tableExists(name: string) {
  const table = sqlite
    .query<{ name: string }, [string]>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
    )
    .get(name);

  return Boolean(table);
}
