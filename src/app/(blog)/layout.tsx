import Header from '@/components/layout/header/header'
import Footer from '@/components/layout/footer'

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-full">
      <Header />
      <div className="pt-[4.5rem] fill-content">
        {/* <div className="fixed z-[-999] inset-0 bg-[url('/img/index.webp')] before:content-[''] bg-cover bg-center bg-no-repeat before:absolute before:inset-0 before:bg-black/50" /> */}

        {children}
      </div>
      <Footer />
    </div>
  )
}
