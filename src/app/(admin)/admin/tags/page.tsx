import AdminShell from '@/app/(admin)/_components/layout/admin-shell'
import { DataTableContainer } from '@/app/(admin)/_components/table/table'
import { columns } from './_components/table/tags-columns'
import { CreateTagDialog } from './_components/create'
import { cookies } from 'next/headers'
import { TagItem } from '@/types/tag'
import { ApiResponse } from '@/types/api'

// async function fetchTags(): Promise<TagItem[]> {
const getTags = async () => {
  const cookieStore = await cookies()
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/tags`,
    {
      headers: {
        cookie: cookieStore.toString(),
      },
      next: {
        tags: ['tags'],
      },
    }
  )

  if (!response.ok) {
    // 處理 API 錯誤
    console.error('Failed to fetch tags:', await response.text())
    return []
  }

  const data = await response.json()
  console.log('Fetched tags data:', data)
  return data || []
}

export default async function TagsPage() {
  const tags: ApiResponse<TagItem[]> = await getTags()

  return (
    <AdminShell title="標籤管理" actions={<CreateTagDialog />}>
      <DataTableContainer
        columns={columns}
        data={tags.data}
        searchColumnId="name"
      />
    </AdminShell>
  )
}
