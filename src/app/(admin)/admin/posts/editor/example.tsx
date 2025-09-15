"use client";

import MonacoEditor from "@/components/monaco-editor/monaco-editor";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LANGUAGES = [
  { value: "mdx", label: "MDX" },
  { value: "markdown", label: "Markdown" },
];

const THEMES = [
  { value: "vs-dark", label: "暗色主題" },
  { value: "light", label: "亮色主題" },
  { value: "hc-black", label: "高對比黑色" },
];

const CODE_TEMPLATES = {
  mdx: `# MDX 範例\n\n這是一個 MDX 文件。\n\n- 支援 Markdown 語法\n- 可以嵌入 React 元件\n`,
  markdown: `# Markdown 範例\n\n這是一個 Markdown 文件。\n\n- 支援標準 Markdown 語法\n- 可用於筆記、文件等\n`,
};

export default function EditorPage() {
  const [code, setCode] = useState(CODE_TEMPLATES.mdx);
  const [language, setLanguage] = useState("mdx");
  const [theme, setTheme] = useState("vs-dark");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    // 自動載入對應語言的範例程式碼
    if (CODE_TEMPLATES[newLanguage as keyof typeof CODE_TEMPLATES]) {
      setCode(CODE_TEMPLATES[newLanguage as keyof typeof CODE_TEMPLATES]);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const saveCode = () => {
    // 這裡可以添加儲存邏輯
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${getFileExtension(language)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileExtension = (lang: string): string => {
    const extensions: { [key: string]: string } = {
      mdx: "mdx",
      markdown: "md",
    };
    return extensions[lang] || "txt";
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      alert("程式碼已複製到剪貼簿！");
    } catch (err) {
      console.error("複製失敗:", err);
    }
  };

  const clearCode = () => {
    if (confirm("確定要清空所有程式碼嗎？")) {
      setCode("");
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${
        isFullscreen ? "fixed inset-0 z-50 bg-white" : "h-screen"
      } flex flex-col`}
    >
      {/* 頂部工具列 */}
      <Card className="rounded-none border-x-0 border-t-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-xl">Monaco Editor</CardTitle>
              <Badge variant="secondary">v4.7.0</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                複製
              </Button>
              <Button onClick={clearCode} variant="outline" size="sm">
                清空
              </Button>
              <Button onClick={toggleFullscreen} variant="outline" size="sm">
                {isFullscreen ? "退出全螢幕" : "全螢幕"}
              </Button>
              <Button onClick={saveCode} size="sm">
                下載
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">語言:</label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">主題:</label>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {THEMES.map((themeOption) => (
                    <SelectItem
                      key={themeOption.value}
                      value={themeOption.value}
                    >
                      {themeOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 編輯器區域 */}
      <div className="flex-1 border">
        <MonacoEditor
          value={code}
          onChange={handleEditorChange}
          language={language}
          theme={theme}
          height="100%"
          options={{
            minimap: { enabled: !isFullscreen },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {/* 底部狀態列 */}
      <Card className="rounded-none border-x-0 border-b-0">
        <CardContent className="py-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>
                語言: {LANGUAGES.find((l) => l.value === language)?.label}
              </span>
              <span>主題: {THEMES.find((t) => t.value === theme)?.label}</span>
              <span>字元數: {code.length}</span>
              <span>行數: {code.split("\n").length}</span>
            </div>
            <span>Monaco Editor for Next.js</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
