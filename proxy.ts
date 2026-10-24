import {NextRequest, NextResponse} from 'next/server'

/** Rewrite `/some-page/studio` and `/some-page/edit` to the editor shortcut. */
export function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl
  if (pathname === '/studio' || pathname.startsWith('/studio/')) return NextResponse.next()

  const suffix = pathname.endsWith('/studio') ? '/studio' : pathname.endsWith('/edit') ? '/edit' : null
  if (!suffix) return NextResponse.next()

  const target = request.nextUrl.clone()
  target.pathname = '/edit'
  target.searchParams.set('path', pathname.slice(0, -suffix.length) || '/')
  return NextResponse.rewrite(target)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
