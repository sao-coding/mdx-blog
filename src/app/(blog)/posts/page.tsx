"use client";

import { ApiResponse } from "@/types/api";
import { PostItem } from "@/types/post";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const PostsPage = () => {
  const { data, error, isLoading } = useQuery<ApiResponse<PostItem[]>>({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/public/posts`
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <div className="mt-20">
      <h1>Posts</h1>
      <ul>
        {data?.data.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsPage;
