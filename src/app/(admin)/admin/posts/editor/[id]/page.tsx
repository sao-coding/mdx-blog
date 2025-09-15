"use client";

import { postSchema } from "@/schemas/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import MultipleSelector, {
  type Option,
} from "@/components/ui/multiple-selector";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MonacoEditor, MonacoEditorExample } from "@/components/monaco-editor";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  FileText,
  Settings,
  ImageIcon,
  Save,
  Send,
  Eye,
  Clock,
  Folder,
} from "lucide-react";
import { use, useState } from "react";
import PostEditor from "../_components/post-editor";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";
import { PostItem } from "@/types/post";

const OPTIONS: Option[] = [
  { label: "生活", value: "lifestyle" },
  { label: "科技", value: "technology" },
  { label: "旅遊", value: "travel" },
  { label: "美食", value: "food" },
  { label: "健康", value: "health" },
  { label: "教育", value: "education" },
  { label: "藝術", value: "art" },
  { label: "運動", value: "sports" },
  { label: "音樂", value: "music" },
  { label: "電影", value: "movies" },
];

const PostEditorPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      slug: "",
      title: "",
      content: "",
      summary: "",
      category: "",
      tags: [],
      coverImage: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: "asdadsadadasd",
      allowComments: true,
      isFeatured: false,
      isSticky: false,
      status: "draft",
    },
  });

  function onSaveDraft(data: z.infer<typeof postSchema>) {
    setIsSavingDraft(true);
    const draftData = { ...data, status: "draft" };
    console.log("Saving draft:", draftData);
    toast.success("草稿已儲存", {
      description: "您的文章已儲存為草稿，可以稍後繼續編輯。",
    });
    setIsSavingDraft(false);
  }

  function onPublish(data: z.infer<typeof postSchema>) {
    setIsPublishing(true);
    const publishData = { ...data, status: "published" };
    console.log("Publishing post:", publishData);
    toast.success("文章已發佈", {
      description: "您的文章已成功發佈，讀者現在可以看到它了。",
    });
    setIsPublishing(false);
  }

  function onArchive(data: z.infer<typeof postSchema>) {
    const archiveData = { ...data, status: "archived" };
    console.log("Archiving post:", archiveData);
    toast.success("文章已封存", {
      description: "文章已移至封存區，不會在前台顯示。",
    });
  }

  const { data: postData } = useQuery<ApiResponse<PostItem>>({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/posts/${id}`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    },
  });

  return (
    <>
      <PostEditor postData={postData?.data} />
    </>
  );
};

export default PostEditorPage;
