'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/api'
import { TagItem } from '@/types/tag'
import { updateTags } from '../_actions/tags-actions'

const formSchema = z.object({
  name: z.string().min(1, { message: '名稱為必填' }),
  slug: z.string().min(1, { message: '網址別名為必填' }),
  description: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean(),
})

interface EditTagDialogProps {
  tag: TagItem
  children: React.ReactNode
}

export function EditTagDialog({ tag, children }: EditTagDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      color: '',
      isActive: true,
    },
  })

  useEffect(() => {
    if (tag) {
      form.reset({
        name: tag.name,
        slug: tag.slug,
        description: tag.description ?? '',
        color: tag.color ?? '',
        isActive: tag.isActive,
      })
    }
  }, [tag, form, isOpen])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/tags/${tag.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      }
    )

    const result: ApiResponse<TagItem> = await res.json()
    setIsSubmitting(false)

    if (result.status === 'success') {
      await updateTags() // 成功後重新驗證標籤以更新列表
      toast.success('標籤已成功更新')
      setIsOpen(false)
    } else {
      toast.error(result.message || '更新標籤失敗')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>編輯標籤</DialogTitle>
          <DialogDescription>修改以下資訊以更新標籤。</DialogDescription>
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
                    <Input {...field} placeholder="例如：#000000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>啟用狀態</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                {isSubmitting ? '更新中...' : '儲存變更'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
