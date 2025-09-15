# Copilot Instructions for mdx-blog

## 專案架構與核心設計

- **Next.js 15 App Router**：所有頁面放於 `src/app/`，路由即目錄結構。使用 `(admin)` 群組路由分離管理後台。
- **元件分層**：
  - `src/components/ui/`：shadcn/ui 基礎元件（Button、Table、Input 等），依 `components.json` 設定安裝
  - `src/(blog)`：部落格
  - `src/(admin)`：後台管理
  - `src/components/`：業務元件（MonacoEditor、TableOfContent 等）
  - `src/components/ui/`：shadcn/ui 元件（Button、Input 等）
  - `src/mdxComponents/`：MDX 專用元件（Mermaid、Echarts），支援圖表與公式渲染
  - `src/hooks/`：自訂 Hook（useAuth、useFetch 等）
  - `src/lib/`：共用邏輯（auth-client.ts、utils.ts）
  - `src/utils/`：工具函式，如 `calculateSomeHow()` 計算閱讀時間
  - `src/types/`：型別定義（Post、User 等）
  - `src/schemas/`：Zod 驗證模式（Post、User 等）
  - `public/`：靜態資源（SVG 圖標、favicon）

## 主要開發模式與慣例

- **型別安全**：全專案 TypeScript strict 模式，禁止使用 `any`。參考 `src/types/post.ts`、`src/schemas/post.ts` 的 Zod 驗證模式。
- **UI 樣式**：Tailwind CSS + shadcn/ui "new-york" 風格，優先使用 `cn()` 工具函式合併 className。
- **資料查詢**：統一使用 `@tanstack/react-query`，參考 `src/app/providers.tsx` 的 QueryClient 設定。
- **表格展示**：複雜表格使用 `@tanstack/react-table` + shadcn/ui Table，參考 `src/app/(admin)/admin/posts/_components/table/posts-table.tsx` 的實現模式。
- **認證流程**：使用 `better-auth`，參考 `src/lib/auth-client.ts` 與 `src/app/login/page.tsx` 的登入/註冊實現。
- **API 整合**：外部 API (localhost:3030)，使用 `ApiResponse<T>` 型別，參考 `src/types/api.ts`。
- **MDX 支援**：支援 Mermaid、Echarts、KaTeX，元件集中於 `src/mdxComponents/`。
- **Monaco 編輯器**：用於文章編輯，參考 `src/components/monaco-editor/monaco-editor.tsx`。
- **命名慣例**：檔案 kebab-case，React 元件 PascalCase，函式/變數 camelCase。
- **註解規範**：所有實作需有 JSDoc 註解，說明用途、參數、回傳值。

## 關鍵開發工作流程

- **新增 shadcn/ui 元件**：`pnpm dlx shadcn@latest add <component>`，元件會自動安裝至 `src/components/ui/`
- **資料表格實現**：
  1. 定義 ColumnDef 於 `posts-columns.tsx`
  2. 使用 `useReactTable` hook 於 `posts-table.tsx`
  3. 整合分頁、排序、篩選功能
- **API 資料獲取**：Server Component 使用 `fetch()` + cookies，Client Component 使用 react-query
- **文章編輯流程**：`/admin/posts/editor/[id]` 路由，使用 MonacoEditor 編輯 MDX 內容
- **錯誤處理**：使用共用 `ErrorComponent`、`LoadingComponent`（見 `src/components/index.tsx`）

## 專案特定模式

- **文章狀態管理**：`draft`、`published`、`archived`，使用 Badge 元件顯示狀態
- **表格操作**：支援批量選擇、排序、分頁，參考 `posts-table.tsx` 的實現
- **側邊欄導航**：管理後台使用 shadcn/ui Sidebar，參考 `src/app/(admin)/_components/app-sidebar.tsx`
- **表單驗證**：使用 react-hook-form + Zod，參考 `src/schemas/post.ts`
- **日期處理**：使用 dayjs，參考 `posts-columns.tsx` 的日期格式化
- **主題切換**：支援深色/淺色主題，使用 next-themes

## 開發、建置與常用指令

- 套件管理：`pnpm`（`pnpm install`、`pnpm add <pkg>`）
- 啟動開發：`pnpm dev`（啟用 turbopack）
- 建置：`pnpm build`，正式啟動：`pnpm start`
- 新增 shadcn/ui 元件：`pnpm dlx shadcn@latest add`
- Lint：`pnpm lint`（ESLint 設定於 `eslint.config.mjs`）

## 範例參考

- **完整表格實現**：`src/app/(admin)/admin/posts/_components/table/`
- **認證頁面**：`src/app/login/page.tsx`
- **MDX 元件**：`src/mdxComponents/`
- **工具函式**：`src/utils/index.ts`
- **API 型別**：`src/types/`

---

如需更動此說明，請保留現有結構並補充專案特有規則。
