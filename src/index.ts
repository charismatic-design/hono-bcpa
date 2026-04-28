import { Hono } from "hono";
import comments from "./comments/index.js";
import posts from "./post/index.js";
import users from "./users/index.js";

const app = new Hono();

app.get("/", (c) =>
  c.json({
    message: "Hono CRUD API",
    resources: {
      users: "/users",
      posts: "/posts",
      comments: "/comments",
    },
  }),
);

app.route("/users", users);
app.route("/posts", posts);
app.route("/comments", comments);

export default app;
