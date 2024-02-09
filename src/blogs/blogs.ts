import { Hono } from "hono";

const app = new Hono();

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

// 全てのポストを取得
app.get("/", (c) => c.json({ posts: blogPosts }));

// 特定のポストをIDで取得
app.get("/:id", (c) => {
  const id = c.req.param("id");
  const post = blogPosts.find((p) => p.id === id);
  if (post) {
    return c.json(post);
  } else {
    return c.json({ message: "Post not found" }, 404);
  }
});

// ポストを作成
app.post("/", async (c) => {
  const { title, content } = await c.req.json();
  const newPost = { id: String(blogPosts.length + 1), title, content };
  blogPosts = [...blogPosts, newPost];
  return c.json(newPost, 201);
});

// ポストを更新
app.put("/:id", async (c) => {
  const { id } = c.req.param();
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
  const { id } = c.req.param();
  const index = blogPosts.findIndex((p) => p.id === id);
  if (index === -1) {
    return c.json({ message: "Post not found" }, 404);
  }
  blogPosts = blogPosts.filter((p) => p.id !== id);
  return c.json({ message: "Post deleted" });
});

export default app;
