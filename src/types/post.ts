// {
//     "status": "success",
//     "message": "獲取文章成功",
//     "data": {
//         "id": "0198945a-de26-765b-af8b-9ef709e984dd",
//         "title": "測試文章標題",
//         "summary": "這是文章摘要，可選填。",
//         "content": "test",
//         "slug": "test-article-slug",
//         "coverImage": "https://example.com/image.jpg",
//         "status": "draft",
//         "publishedAt": null,
//         "viewCount": 0,
//         "likeCount": 0,
//         "commentCount": 0,
//         "allowComments": true,
//         "isFeatured": false,
//         "isSticky": false,
//         "createdAt": "2025-08-10T14:20:39.847Z",
//         "updatedAt": "2025-09-06T17:04:08.984Z",
//         "category": {
//             "id": "0198a2d9-1bbe-7079-814f-fd6ac8a7b66b",
//             "name": "生活",
//             "slug": "life",
//             "color": null
//         },
//         "tags": [
//             {
//                 "id": "01991fa9-1e9e-7228-85c6-6b1d456774a0",
//                 "name": "美食",
//                 "slug": "food",
//                 "color": "#"
//             }
//         ],
//         "author": {
//             "id": "0198945a-9a60-72db-a4a8-62721cfea2f6",
//             "username": "testuser",
//             "displayUsername": "testuser",
//             "name": "測試使用者",
//             "email": "test@example.com",
//             "emailVerified": false,
//             "image": null,
//             "role": null,
//             "banned": false,
//             "banReason": null,
//             "banExpires": null,
//             "createdAt": "2025-08-10T14:20:22.495Z",
//             "updatedAt": "2025-08-10T14:20:22.495Z"
//         }
//     }
// }

import { CategoryItem } from "./categories";
import { TagItem } from "./tags";

// post 清單 不包含 content
export interface PostItem {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  slug: string;
  coverImage: string | null;
  status: "draft" | "published" | "archived";
  publishedAt: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  allowComments: boolean;
  isFeatured: boolean;
  isSticky: boolean;
  createdAt: string;
  updatedAt: string;
  category: CategoryItem;
  tags: TagItem[];
  author: {
    id: string;
    username: string;
    displayUsername: string;
    name: string | null;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: string | null;
    banned: boolean;
    banReason: string | null;
    banExpires: string | null;
    createdAt: string;
    updatedAt: string;
  };
}
