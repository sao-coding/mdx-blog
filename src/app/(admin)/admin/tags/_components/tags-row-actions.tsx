'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Loader2Icon, MoreHorizontalIcon } from 'lucide-react'
import { type Row } from '@tanstack/react-table'
import { useState } from 'react'
import { toast } from 'sonner'
import { updateTags } from '../_actions/tags-actions'
import type { TagItem } from '@/types/tag'
import { ApiResponse } from '@/types/api'
import Link from 'next/link'
import { TagFormDialog } from './table/tag-form-dialog'

interface TagsRowActionsProps {
  row: Row<TagItem>
}

export function TagsRowActions({ row }: TagsRowActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const tag = row.original

  const handleDelete = async () => {
    console.log('Delete', tag?.id)
    setIsLoading(true)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/tags/${tag?.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )
    const data: ApiResponse<TagItem> = await res.json()
    if (data.status === 'success') {
      // 成功後重新驗證標籤以更新列表
      await updateTags()
      toast.success('標籤已刪除')
      setIsOpen(false)
    } else {
      console.error('Failed to delete tag:', data.message)
      toast.error('刪除標籤失敗，請稍後再試')
    }
    setIsLoading(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">開啟選單</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>更多操作</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(tag.id)}
          >
            複製標籤 ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <TagFormDialog mode="edit" tag={tag}>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
              className="cursor-pointer"
            >
              編輯標籤
            </DropdownMenuItem>
          </TagFormDialog>
          <DropdownMenuItem asChild>
            <Link href={`/tags/${tag.slug}`} target="_blank">
              查看標籤
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              刪除標籤
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>確定要刪除這篇標籤嗎？</AlertDialogTitle>
          <AlertDialogDescription>
            此操作無法復原。這將永久刪除標籤「{tag.name}」及其相關數據。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>取消</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2Icon className="size-4 animate-spin mr-2" />
                正在刪除...
              </>
            ) : (
              '刪除'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
