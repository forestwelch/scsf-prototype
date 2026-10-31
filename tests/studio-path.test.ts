import {describe, expect, test} from 'bun:test'
import {isSanityStudioPath} from '../lib/studio-path'

describe('Studio full-screen routes', () => {
  test('recognizes Studio routes and page edit shortcuts', () => {
    expect(isSanityStudioPath('/studio')).toBe(true)
    expect(isSanityStudioPath('/studio/structure/pages')).toBe(true)
    expect(isSanityStudioPath('/events/studio')).toBe(true)
  })

  test('leaves public page routes in the normal site shell', () => {
    expect(isSanityStudioPath('/events')).toBe(false)
    expect(isSanityStudioPath('/membership')).toBe(false)
  })
})
