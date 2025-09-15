import { cookies } from "next/headers";

// app/page.tsx (Server Component)
export default async function Page() {
  const cookieStore = await cookies();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/get-session`,
    {
      headers: {
        cookie: cookieStore.toString(), // Next.js 15 可用 cookies() 取得
      },
      cache: "no-store",
    }
  );
  const session = await res.json();

  if (!session) return <div>未登入</div>;
  return <div>歡迎 {session.user.name}</div>;
}
