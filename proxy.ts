import {NextRequest, NextResponse} from 'next/server'

/** Rewrite `/some-page/studio` to the editor shortcut. */
export function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl
  if (pathname === '/studio' || pathname.startsWith('/studio/')) return NextResponse.next()
  if (pathname === '/edit') return NextResponse.redirect(new URL('/studio', request.url))

  if (!pathname.endsWith('/studio')) return NextResponse.next()

  const target = request.nextUrl.clone()
  target.pathname = '/edit'
  target.searchParams.set('path', pathname.slice(0, -'/studio'.length) || '/')
  return NextResponse.rewrite(target)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
