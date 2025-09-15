import { Suspense } from "react";
import { evaluate } from "next-mdx-remote-client/rsc";
import type {
  EvaluateOptions,
  MDXComponents,
} from "next-mdx-remote-client/rsc";
import { Metadata } from "next";
import { calculateSomeHow, getSourceSomeHow } from "@/utils/index";
import { ErrorComponent, LoadingComponent } from "@/components/index";
import TableOfContent from "@/components/toc";
import { Test, Echarts } from "@/components/mdx/index";
import Mermaid from "@/components/mdx/Mermaid";
import Count from "@/components/mdx/count";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkFlexibleToc, { TocItem } from "remark-flexible-toc";
import rehypeSlug from "rehype-slug";

type Scope = {
  readingTime: string;
  toc?: TocItem[];
};

type Frontmatter = {
  title: string;
  description?: string;
  keywords?: string;
  author: string;
  date?: string;
  showToc?: boolean;
};

// 可擴充的 MDX 元件映射
const components: MDXComponents = {
  Test,
  Count,
  wrapper: function Wrapper({
    children,
  }: React.ComponentPropsWithoutRef<"div">) {
    return <div className="mdx-wrapper">{children}</div>;
  },
  code: ({ className, children }) => {
    if (className === "language-mermaid") {
      return <Mermaid>{String(children).trim()}</Mermaid>;
    }
    if (className === "language-echarts") {
      return <Echarts>{String(children).trim()}</Echarts>;
    }
    return <code className={className}>{children}</code>;
  },
};

// SEO metadata（可依需求調整）
export const metadata: Metadata = {
  title: "MDX Blog | Home",
  description: "A modern MDX-powered blog built with Next.js",
};

export default async function Page() {
  let source: string | null = null;
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    source = await getSourceSomeHow();
    console.log("MDX source:", source);
  } catch (err) {
    return <ErrorComponent error="讀取內容時發生錯誤！" />;
  }

  if (!source || typeof source !== "string") {
    return <ErrorComponent error="找不到內容來源或內容格式錯誤！" />;
  }

  const options: EvaluateOptions<Scope> = {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkMath, remarkFlexibleToc],
      rehypePlugins: [rehypeKatex, rehypeSlug],
    },
    parseFrontmatter: true,
    scope: {
      readingTime: calculateSomeHow(source),
    },
    vfileDataIntoScope: "toc", // 這行會把 toc 注入 scope.toc
  };

  const { content, frontmatter, scope, error } = await evaluate<
    Frontmatter,
    Scope
  >({
    source,
    options,
    components,
  });

  console.log("Frontmatter:", frontmatter);
  console.log("Scope:", scope);

  if (error) {
    return <ErrorComponent error={error.message} />;
  }

  const showToc = frontmatter.showToc !== false;

  return (
    <main className="prose mx-auto py-8">
      {showToc && <TableOfContent toc={scope.toc} />}
      <Suspense fallback={<LoadingComponent />}>{content}</Suspense>
    </main>
  );
}
