// {
//   "status": "success",
//   "message": "成功獲取分類列表",
//   "meta": {
//     "authType": "session",
//     "page": 1,
//     "limit": 20,
//     "total": 1,
//     "totalPages": 1,
//     "hasNext": false,
//     "hasPrev": false,
//     "sort": "name",
//     "order": "asc",
//     "search": null,
//     "filters": {
//       "isActive": null,
//       "parentId": null
//     },
//     "stats": {
//       "active": 1,
//       "inactive": 0,
//       "topLevel": 1
//     }
//   },
//   "data": [
//     {
//       "id": "0198a2d9-1bbe-7079-814f-fd6ac8a7b66b",
//       "name": "生活",
//       "slug": "life",
//       "description": null,
//       "color": null,
//       "parentId": null,
//       "sortOrder": 0,
//       "isActive": true,
//       "postCount": 0,
//       "createdAt": "2025-08-13T09:53:14.174Z",
//       "updatedAt": "2025-08-13T09:53:14.174Z"
//     }
//   ]
// }

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}
