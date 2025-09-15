import {
  IconBrandLine,
  IconBrandThreads,
  IconBrandX,
  IconPencil,
} from '@tabler/icons-react'
import {
  Icon,
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconCategory,
  IconHome,
  IconSignature,
  // IconTags,
  IconUser,
} from '@tabler/icons-react'

type NavLinks = {
  icon?: Icon
  href?: string
  text: string
  children?: { icon?: Icon; href: string; text: string; show: boolean }[]
}[]

export const NAV_LINKS: NavLinks = [
  {
    icon: IconHome,
    href: '/',
    text: '首頁',
  },
  {
    icon: IconSignature,
    href: '/blog',
    text: '部落格',
    children: [
      {
        icon: IconPencil,
        href: '/blog/drafts',
        text: '草稿區',
        show: false,
      },
      {
        href: '/blog/about',
        text: '關於我',
        show: true,
      },
      { href: '/blog/archives', text: '文章歸檔', show: true },
    ],
  },
  {
    icon: IconCategory,
    href: '/categories',
    text: '分類',
    children: [
      { href: '/categories/web', text: '網頁開發', show: true },
      { href: '/categories/life', text: '生活隨筆', show: true },
      { href: '/categories/tech', text: '科技新知', show: true },
    ],
  },
  // 更多
  {
    text: '更多',
    children: [
      // { icon: IconUser, href: "/about", text: "關於我", show: true },
      // { icon: IconTags, href: "/tags", text: "標籤", show: true },
      {
        icon: IconBrandX,
        href: '/nav-test',
        text: '推特',
        show: true,
      },
    ],
  },
]

// 社交link

type SocialLinks = {
  icon: Icon
  link: string
  color: string
}[]

export const SOCIAL_LINKS: SocialLinks = [
  {
    icon: IconBrandGithub,
    link: 'https://github.com/sao-coding',
    color: 'bg-gray-900',
  },
  {
    icon: IconBrandFacebook,
    link: 'https://www.facebook.com/Black.HANK.X',
    color: 'bg-blue-700',
  },
  {
    icon: IconBrandLine,
    link: 'https://line.me/ti/p/t7Fr6CQFLi',
    color: 'bg-green-700',
  },
  {
    icon: IconBrandInstagram,
    link: 'https://www.instagram.com/_xox._.xox._.xox._.xox._.xox_',
    color: 'bg-pink-700',
  },
  {
    icon: IconBrandThreads,
    link: 'https://www.threads.net/@_xox._.xox._.xox._.xox._.xox_',
    color: 'bg-black',
  },
  {
    icon: IconBrandX,
    link: 'https://twitter.com/sao_coding',
    color: 'bg-gray-800',
  },
]
