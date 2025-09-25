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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

import { ApiResponse } from '@/types/api'
import { CategoryItem } from '@/types/category'
import { updateCategories } from '../_actions/categories-actions'
import { categoryFormSchema } from '@/schemas/category'

type CategoryFormData = z.infer<typeof categoryFormSchema>

interface CategoryFormDialogProps {
  mode: 'create' | 'edit'
  category?: CategoryItem
  children?: React.ReactNode
}

export function CategoryFormDialog({
  mode,
  category,
  children,
}: CategoryFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditMode = mode === 'edit'

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      color: '#000000',
      parentId: null,
    },
  })

  useEffect(() => {
    if (isEditMode && category) {
      form.reset({
        name: category.name,
        slug: category.slug,
        description: category.description ?? '',
        color: category.color ?? '#000000',
        parentId: category.parentId,
      })
    } else {
      form.reset({
        name: '',
        slug: '',
        description: '',
        color: '#000000',
        parentId: null,
      })
    }
  }, [category, form, isEditMode, isOpen])

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true)

    const url = isEditMode
      ? `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${category?.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`
    const method = isEditMode ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const result: ApiResponse<CategoryItem> = await res.json()

      if (result.status === 'success') {
        await updateCategories()
        toast.success(`分類已成功${isEditMode ? '更新' : '建立'}`)
        setIsOpen(false)
        if (!isEditMode) form.reset()
      } else {
        toast.error(result.message || `分類${isEditMode ? '更新' : '建立'}失敗`)
      }
    } catch (error) {
      toast.error('發生未知錯誤，請稍後再試。')
    } finally {
      setIsSubmitting(false)
    }
  }

  const title = isEditMode ? '編輯分類' : '新增分類'
  const description = isEditMode
    ? '修改以下資訊以更新分類。'
    : '填寫以下資訊以建立一個新的分類。'
  const submitButtonText = isEditMode ? '儲存變更' : '建立分類'
  const submittingButtonText = isEditMode ? '更新中...' : '建立中...'

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          children
        ) : (
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            新增分類
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
                    <Input {...field} placeholder="例如：前端技術" />
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
                    <Input {...field} placeholder="例如：frontend" />
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
                      placeholder="關於這個分類的簡短描述..."
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
