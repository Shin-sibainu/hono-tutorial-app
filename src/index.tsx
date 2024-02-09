import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { prettyJSON } from "hono/pretty-json";
import posts from "./blogs/blogs";

// ブログポストを保持するメモリ内の配列
let blogPosts = [
  {
    id: "1",
    title: "ブログポスト1",
    content: "これはブログポスト1の内容です。",
  },
  {
    id: "2",
    title: "ブログポスト2",
    content: "これはブログポスト2の内容です。",
  },
  {
    id: "2",
    title: "ブログポスト2",
    content: "これはブログポスト2の内容です。",
  },
];

//https://hono.dev/guides/examples
const app = new Hono();

// app.route("/posts", posts);

app.use("*", prettyJSON());

app.get("/", (c) => {
  return c.text("Blog API");
});

// 全てのポストを取得
app.get("/posts", (c) => c.json({ posts: blogPosts }));

// 特定のポストをIDで取得
app.get("/posts/:id", (c) => {
  const id = c.req.param("id");
  const post = blogPosts.find((p) => p.id === id);
  if (post) {
    return c.json(post);
  } else {
    return c.json({ message: "Post not found" }, 404);
  }
});

// ポストを作成
app.post("/posts", async (c) => {
  const { title, content } = await c.req.json<{
    title: string;
    content: string;
  }>();
  const newPost = { id: String(blogPosts.length + 1), title, content };
  blogPosts = [...blogPosts, newPost];
  return c.json(newPost, 201);
});

// ポストを更新
app.put("/posts/:id", async (c) => {
  const id = c.req.param("id");
  const index = blogPosts.findIndex((p) => p.id === id);
  if (index === -1) {
    return c.json({ message: "Post not found" }, 404);
  }
  const { title, content } = await c.req.json();
  blogPosts[index] = { ...blogPosts[index], title, content };
  return c.json(blogPosts[index]);
});

// ポストを削除
app.delete("/:id", (c) => {
  const id = c.req.param("id");
  const index = blogPosts.findIndex((p) => p.id === id);
  if (index === -1) {
    return c.json({ message: "Post not found" }, 404);
  }
  blogPosts = blogPosts.filter((p) => p.id !== id);
  return c.json({ message: "Post deleted" });
});

// module worker
export default app;
