const fetchData = async () => {
  // http://localhost:3000/posts/20250926
  const res = await fetch("http://localhost:3000/posts/20250926");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.text();
  console.log("Fetched data:", data);

  return data;
};

export default async function HomePage() {
  const data = await fetchData();
  return (
    <main className="container mx-auto px-4 pt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">首頁</h1>
        <p className="text-lg text-muted-foreground text-center">
          歡迎來到我的網站！這裡展示了帶有動畫圖示的導航標題。
        </p>
      </div>
    </main>
  );
}
