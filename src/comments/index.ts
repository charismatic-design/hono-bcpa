import { Hono } from "hono";
import { getPostById } from "../post/service.js";
import {
  createComment,
  deleteComment,
  getCommentById,
  getComments,
  getCommentsByPostId,
  updateComment,
} from "./service.js";

const comments = new Hono();

comments.get("/", async (c) => c.json(await getComments()));

comments.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const comment = await getCommentById(id);

  if (!comment) {
    return c.json({ error: "Comment not found" }, 404);
  }

  return c.json(comment);
});

comments.get("/post/:postId", async (c) => {
  const postId = Number(c.req.param("postId"));

  if (!(await getPostById(postId))) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json(await getCommentsByPostId(postId));
});

comments.post("/", async (c) => {
  const body = await c.req.json();
  const { content } = body;
  const postId = Number(body.postId);

  if (!content || !postId) {
    return c.json({ error: "content and postId are required" }, 400);
  }

  if (!(await getPostById(postId))) {
    return c.json({ error: "Post not found" }, 404);
  }

  const comment = await createComment({ content, postId });
  return c.json(comment, 201);
});

comments.put("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  const postId = body.postId === undefined ? undefined : Number(body.postId);

  if (postId !== undefined && !(await getPostById(postId))) {
    return c.json({ error: "Post not found" }, 404);
  }

  const comment = await updateComment(id, {
    content: body.content,
    postId,
  });

  if (!comment) {
    return c.json({ error: "Comment not found" }, 404);
  }

  return c.json(comment);
});

comments.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const comment = await deleteComment(id);

  if (!comment) {
    return c.json({ error: "Comment not found" }, 404);
  }

  return c.json(comment);
});

export default comments;
