// {
//   "status": "success",
//   "message": "成功獲取標籤列表",
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
//       "isActive": null
//     },
//     "stats": {
//       "active": 1,
//       "inactive": 0
//     }
//   },
//   "data": [
//     {
//       "id": "01991fa9-1e9e-7228-85c6-6b1d456774a0",
//       "name": "美食",
//       "slug": "food",
//       "description": null,
//       "color": "#",
//       "isActive": true,
//       "postCount": 0,
//       "createdAt": "2025-09-06T15:33:21.182Z",
//       "updatedAt": "2025-09-06T15:33:21.182Z"
//     }
//   ]
// }

export interface TagItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  isActive: boolean;
  postCount: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
