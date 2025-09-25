'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

import { ApiResponse } from '@/types/api'
import { TagItem } from '@/types/tag'
import { updateTags } from '../../_actions/tags-actions'
import { tagFormSchema } from '@/schemas/tag'

interface TagFormDialogProps {
  mode: 'create' | 'edit'
  tag?: TagItem
  children?: React.ReactNode
}

export function TagFormDialog({ mode, tag, children }: TagFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditMode = mode === 'edit'

  const form = useForm<z.infer<typeof tagFormSchema>>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      color: '#000000',
    },
  })

  useEffect(() => {
    if (isEditMode && tag) {
      form.reset({
        name: tag.name,
        slug: tag.slug,
        description: tag.description ?? '',
        color: tag.color ?? '#000000',
      })
    } else {
      form.reset({
        name: '',
        slug: '',
        description: '',
        color: '#000000',
      })
    }
  }, [tag, form, isEditMode, isOpen])

  const onSubmit = async (data: z.infer<typeof tagFormSchema>) => {
    setIsSubmitting(true)

    const url = isEditMode
      ? `${process.env.NEXT_PUBLIC_API_URL}/admin/tags/${tag?.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/admin/tags`
    const method = isEditMode ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    const result: ApiResponse<TagItem> = await res.json()
    setIsSubmitting(false)

    if (result.status === 'success') {
      await updateTags()
      toast.success(`標籤已成功${isEditMode ? '更新' : '建立'}`)
      setIsOpen(false)
      if (!isEditMode) form.reset()
    } else {
      toast.error(result.message || `標籤${isEditMode ? '更新' : '建立'}失敗`)
    }
  }

  const title = isEditMode ? '編輯標籤' : '新增標籤'
  const description = isEditMode
    ? '修改以下資訊以更新標籤。'
    : '填寫以下資訊以建立一個新的標籤。'
  const submitButtonText = isEditMode ? '儲存變更' : '建立標籤'
  const submittingButtonText = isEditMode ? '更新中...' : '建立中...'

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          children
        ) : (
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            新增標籤
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名稱</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="例如：Next.js" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>網址別名 (Slug)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="例如：next-js" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="關於這個標籤的簡短描述..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>顏色</FormLabel>
                  <FormControl>
                    <Input {...field} type="color" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsOpen(false)}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? submittingButtonText : submitButtonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
