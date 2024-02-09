export interface Post {
  id: string;
  title: string;
  body: string;
}

export const getPosts = async (): Promise<Post[]> => {
  const posts: Post[] = [];

  return posts;
};
