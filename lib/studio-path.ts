export function isSanityStudioPath(pathname: string) {
  return pathname === '/studio' || pathname.startsWith('/studio/') || pathname.endsWith('/studio')
}
