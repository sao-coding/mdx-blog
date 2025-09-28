import Header from '@/components/layout/header/header'

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="text-[14px]">
      <Header />
      <div className="pt-[4.5rem]">
        {/* <div className="fixed z-[-999] inset-0 bg-[url('/img/index.webp')] before:content-[''] bg-cover bg-center bg-no-repeat before:absolute before:inset-0 before:bg-black/50" /> */}

        {children}
      </div>
    </div>
  )
}
