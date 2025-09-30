import { evaluate } from 'next-mdx-remote-client/rsc'
import {
  MdxRenderer,
  createMergedComponents,
} from '@/components/mdx/mdx-renderer'
import { CustomQuote } from '@/components/mdx/renderers'
import getMdxOptions from '@/components/mdx/parsers'

// 測試用的 MDX 內容
const testMDXContent = `
# MDX 元件測試頁面

這個頁面用來測試可覆寫/擴充的 MDX 元件系統。

## 基本 HTML 元素測試

### 標題測試 (有 scroll-margin-top)
#### 四級標題
##### 五級標題
###### 六級標題

## 程式碼測試

\`\`\`javascript
console.log('Hello World')
\`\`\`

內聯程式碼：\`const x = 1\`

## 自訂元件測試

### Count 元件 (應該被禁用)
<Count />

### CustomQuote 元件 (新增的)
<CustomQuote author="張三">
這是一個自訂的引用元件，支援作者署名和不同樣式。
</CustomQuote>

<CustomQuote variant="warning" author="李四">
這是一個警告樣式的引用。
</CustomQuote>

<CustomQuote variant="info">
這是一個資訊樣式的引用，沒有作者。
</CustomQuote>

### BlogHighlight 元件 (inline 自訂元件)
這是一段包含 <BlogHighlight>高亮文字</BlogHighlight> 的段落。

## Mermaid 圖表測試

\`\`\`mermaid
graph TD
    A[開始] --> B{決策}
    B -->|是| C[執行]
    B -->|否| D[結束]
    C --> D
\`\`\`

## ECharts 圖表測試

\`\`\`echarts
{
  "title": { "text": "測試圖表" },
  "xAxis": { "type": "category", "data": ["Mon", "Tue", "Wed", "Thu", "Fri"] },
  "yAxis": { "type": "value" },
  "series": [{
    "data": [120, 200, 150, 80, 70],
    "type": "line"
  }]
}
\`\`\`

## 結論

以上測試展示了：
1. ✅ 基本 HTML 元素的樣式化
2. ❌ Count 元件被成功禁用 (不應該顯示)
3. ✅ CustomQuote 自訂元件正常工作
4. ✅ BlogHighlight inline 元件正常工作
5. ✅ Mermaid 圖表正常渲染
6. ✅ ECharts 圖表正常渲染
`

export default async function MDXTestPage() {
  // 建立測試用的元件配置：禁用 Count，添加 CustomQuote 和 BlogHighlight
  const testComponents = createMergedComponents({
    Count: null, // 禁用 Count 元件
    CustomQuote, // 添加自訂 Quote 元件
    BlogHighlight: ({ children }: { children: React.ReactNode }) => (
      <span className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded font-semibold">
        {children}
      </span>
    ),
  })

  const { content, error } = await evaluate({
    source: testMDXContent,
    options: getMdxOptions(testMDXContent),
    components: testComponents,
  })

  return (
    <div className="container m-auto mt-[120px] max-w-4xl px-4">
      <article className="prose dark:prose-invert max-w-full">
        <MdxRenderer content={content} error={error} />
      </article>

      <div className="mt-10 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h2 className="text-xl font-bold mb-4">測試說明</h2>
        <ul className="space-y-2">
          <li>• 如果看不到 Count 元件 = 禁用功能正常 ✅</li>
          <li>• 如果看到彩色引用框 = CustomQuote 元件正常 ✅</li>
          <li>• 如果看到黃色高亮文字 = BlogHighlight 元件正常 ✅</li>
          <li>• 如果看到流程圖 = Mermaid 正常 ✅</li>
          <li>• 如果看到折線圖 = ECharts 正常 ✅</li>
        </ul>
      </div>
    </div>
  )
}
