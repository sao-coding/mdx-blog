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
import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ApiKey } from '@/types/api-key'
import { Loader2Icon, MoreHorizontalIcon } from 'lucide-react'
import { type Row } from '@tanstack/react-table'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { apiKeysUpdate } from '../_actions/api-keys-actions'
import { toast } from 'sonner'

interface RowActionsProps {
  row: Row<ApiKey>
}

export function RowActions({ row }: RowActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const r = row.original
  const handleCopy = () => {
    if (typeof window !== 'undefined' && r?.prefix) {
      navigator.clipboard?.writeText(r.prefix)
    }
  }
  const handleToggle = async () => {
    console.log('Toggle enabled for', r?.id)
    // TODO: call API to toggle enabled
  }

  const handleDelete = async () => {
    console.log('Delete', r?.id)
    setIsLoading(true)
    const { data, error } = await authClient.apiKey.delete({
      keyId: r?.id, // required
    })
    if (error) {
      console.error('Failed to delete API key:', error)
      toast('刪除 API 金鑰失敗，請稍後再試')
      return
    }
    // 成功後重新驗證標籤以更新列表
    await apiKeysUpdate()
    toast('API 金鑰已刪除')
    setIsLoading(false)
    setIsOpen(false)
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
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleCopy}>複製前綴</DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggle}>
            {r?.enabled ? '停用' : '啟用'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              variant="destructive"
            >
              刪除
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>確定要刪除嗎？</AlertDialogTitle>
          <AlertDialogDescription>
            此操作無法復原。這將永久刪除此 API 金鑰。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <Button onClick={handleDelete} variant="destructive">
            {isLoading ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
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
