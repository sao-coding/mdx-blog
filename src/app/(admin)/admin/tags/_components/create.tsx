'use client'

import { useState } from 'react'
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
import { PlusIcon } from 'lucide-react'
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

export function CreateTagDialog() {
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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    const result: ApiResponse<TagItem> = await res.json()
    // console.log({ result })
    setIsSubmitting(false)

    if (result.status === 'success') {
      await updateTags() // 成功後重新驗證標籤以更新列表
      toast.success('標籤已成功建立')
      setIsOpen(false)
      form.reset()
    } else {
      toast.error(result.message || '建立標籤失敗')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          新增標籤
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新增標籤</DialogTitle>
          <DialogDescription>
            填寫以下資訊以建立一個新的標籤。
          </DialogDescription>
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
                {isSubmitting ? '建立中...' : '建立標籤'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
