import { Hono } from "hono";
import {
  createUser,
  deleteUser,
  emailExists,
  getPostsForUser,
  getUsers,
  getUsersById,
  updateUser,
} from "./service.js";

const users = new Hono();

users.get("/", async (c) => c.json(await getUsers()));

users.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const user = await getUsersById(id);

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

users.post("/", async (c) => {
  const body = await c.req.json();
  const { name, age, email } = body;

  if (!name || !age || !email) {
    return c.json({ error: "name, age, and email are required" }, 400);
  }

  if (await emailExists(email)) {
    return c.json({ error: "Email already exists" }, 409);
  }

  const user = await createUser({ name, age: Number(age), email });
  return c.json(user, 201);
});

users.put("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();

  if (body.email && (await emailExists(body.email, id))) {
    return c.json({ error: "Email already exists" }, 409);
  }

  const user = await updateUser(id, {
    name: body.name,
    age: body.age === undefined ? undefined : Number(body.age),
    email: body.email,
  });

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

users.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const user = await deleteUser(id);

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

users.get("/:id/posts", async (c) => {
  const id = Number(c.req.param("id"));

  if (!(await getUsersById(id))) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(await getPostsForUser(id));
});

export default users;
