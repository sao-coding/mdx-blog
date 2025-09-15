"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { PostItem } from "@/types/post";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { MoreHorizontal, MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "./posts-table-column-header";
import Link from "next/link";
// export interface PostListItem {
//   id: string;
//   title: string;
//   slug: string;
//   status: "draft" | "published" | "archived";
//   author: string;
//   views: number;
//   comments: number;
//   publishedAt: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

const postStatusMap: Record<string, { label: string; color: string }> = {
  draft: { label: "草稿", color: "bg-gray-200 text-gray-800" },
  published: { label: "已發佈", color: "bg-green-100 text-green-800" },
  archived: { label: "已歸檔", color: "bg-yellow-100 text-yellow-800" },
};

export const columns: ColumnDef<PostItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="全選"
        className="translate-y-[2px]"
      />
    ),
    meta: {
      className: cn(
        "sticky md:table-cell left-0 z-10 rounded-tl",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted"
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="選擇行"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    // header: "標題",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="標題" />
    ),
    cell: ({ row }) => {
      const post = row.original;
      return (
        <Link
          href={`/admin/posts/editor/${post.id}`}
          className="hover:underline flex items-center"
        >
          <span className="ml-2 w-40 truncate">{post.title}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: "author",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="作者" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="狀態" />
    ),
    cell: ({ row }) => {
      const post = row.original;
      return (
        <div className="px-1">
          <Badge className={postStatusMap[post.status]?.color}>
            {postStatusMap[post.status]?.label ?? "-"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="建立時間" />
    ),
    cell: ({ row }) => {
      const date = dayjs(row.original.createdAt).locale("zh-tw");
      return (
        <time dateTime={date.toISOString()}>
          {date.format("YYYY-MM-DD HH:mm")}
        </time>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="更新時間" />
    ),
    cell: ({ row }) => {
      const date = dayjs(row.original.updatedAt).locale("zh-tw");
      return (
        <time dateTime={date.toISOString()}>
          {date.format("YYYY-MM-DD HH:mm")}
        </time>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>更多操作</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              複製文章 ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>查看文章</DropdownMenuItem>
            <DropdownMenuItem>刪除文章</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
