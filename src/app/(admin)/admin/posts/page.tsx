import { ApiResponse } from "@/types/api";
import { PostItem } from "@/types/post";
import { cookies } from "next/headers";
import { PostsTable } from "./_components/table/posts-table";
import { columns } from "./_components/table/posts-columns";

const getPosts = async () => {
  const cookieStore = await cookies();
  console.log(
    "Fetching URL:",
    `${process.env.NEXT_PUBLIC_API_URL}/admin/posts`
  );
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/posts`, {
    headers: {
      cookie: cookieStore.toString(),
    },
  });
  console.log("Fetch response status:", res.status);
  const posts = await res.json();
  console.log("Fetched posts:", posts);
  return posts;
};

const PostsPage = async () => {
  const posts: ApiResponse<PostItem[]> = await getPosts();

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">文章列表</h1>
      <div>
        <PostsTable columns={columns} data={posts.data} />
      </div>
    </>
  );
};

export default PostsPage;
