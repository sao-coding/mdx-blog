import { z } from 'zod'

export const tagFormSchema = z
  .object({
    name: z.string().min(1, '名稱為必填').max(50, '名稱不能超過 50 個字元'),
    slug: z.string().max(50, 'Slug 不能超過 50 個字元').optional(),
    description: z.string().nullable().optional(),
    color: z.string().nullable().optional(),
    isActive: z.boolean(),
  })
  .refine((data) => !data.color || /^#[0-9A-Fa-f]{6}$/.test(data.color), {
    message: '顏色必須是有效的 HEX 色碼',
    path: ['color'],
  })

export type TagFormValues = z.infer<typeof tagFormSchema>
