export interface TagItem {
  id: string
  name: string
  slug: string
  description: string | null
  color: string | null
  isActive: boolean
  postCount?: number
  createdAt: string
  updatedAt: string
}
