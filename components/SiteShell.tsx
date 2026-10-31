'use client'

import {usePathname} from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {isSanityStudioPath} from '@/lib/studio-path'

export default function SiteShell({children}: {children: React.ReactNode}) {
  const pathname = usePathname() || '/'

  // Sanity Studio owns the full viewport. Rendering the public site's sticky
  // header/footer over Studio can cover the editing controls, including Publish.
  if (isSanityStudioPath(pathname)) {
    return <div className="sanity-studio-shell">{children}</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
