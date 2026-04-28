import { Hono } from "hono";
import { getUsersById } from "../users/service.js";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "./service.js";

const posts = new Hono();

posts.get("/", async (c) => c.json(await getPosts()));

posts.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const post = await getPostById(id);

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json(post);
});

posts.post("/", async (c) => {
  const body = await c.req.json();
  const { title, content } = body;
  const userId = Number(body.userId);

  if (!title || !content || !userId) {
    return c.json({ error: "title, content, and userId are required" }, 400);
  }

  if (!(await getUsersById(userId))) {
    return c.json({ error: "User not found" }, 404);
  }

  const post = await createPost({ title, content, userId });
  return c.json(post, 201);
});

posts.put("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  const userId = body.userId === undefined ? undefined : Number(body.userId);

  if (userId !== undefined && !(await getUsersById(userId))) {
    return c.json({ error: "User not found" }, 404);
  }

  const post = await updatePost(id, {
    title: body.title,
    content: body.content,
    userId,
  });

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json(post);
});

posts.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const post = await deletePost(id);

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json(post);
});

export default posts;
