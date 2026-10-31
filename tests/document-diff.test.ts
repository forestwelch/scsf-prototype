import {describe, expect, test} from 'bun:test'
import type {DocumentActionComponent, DocumentActionProps} from 'sanity'
import {hasPublishableChanges} from '../lib/document-diff'
import {disableNoopPublish} from '../sanity/document-actions'

describe('publish change detection', () => {
  test('treats content restored to the published value as a no-op', () => {
    expect(hasPublishableChanges(
      {_id: 'drafts.about', _rev: 'draft-rev', _updatedAt: 'later', title: 'About', content: [{_key: 'a', text: 'Same'}]},
      {_id: 'about', _rev: 'published-rev', _createdAt: 'earlier', title: 'About', content: [{_key: 'a', text: 'Same'}]},
    )).toBe(false)
  })

  test('detects a content change and differing references', () => {
    expect(hasPublishableChanges(
      {_id: 'drafts.about', title: 'About us'},
      {_id: 'about', title: 'About'},
    )).toBe(true)
    expect(hasPublishableChanges(
      {_id: 'drafts.about', related: {_type: 'reference', _ref: 'one'}},
      {_id: 'about', related: {_type: 'reference', _ref: 'two'}},
    )).toBe(true)
  })

  test('allows the first publish when no published record exists', () => {
    expect(hasPublishableChanges({_id: 'drafts.new-page', title: 'A page'}, null)).toBe(true)
    expect(hasPublishableChanges(null, null)).toBe(false)
  })

  test('keeps Sanity Publish disabled when draft content matches published content', () => {
    const originalAction = (() => ({label: 'Publish', disabled: false})) as DocumentActionComponent
    const publish = disableNoopPublish(originalAction)
    const props = {
      id: 'about',
      type: 'sitePage',
      draft: {_id: 'drafts.about', _type: 'sitePage', title: 'About'},
      published: {_id: 'about', _type: 'sitePage', title: 'About'},
    } as DocumentActionProps

    expect(publish(props)?.disabled).toBe(true)
  })

  test('keeps Sanity Publish enabled for a real content change', () => {
    const originalAction = (() => ({label: 'Publish', disabled: false})) as DocumentActionComponent
    const publish = disableNoopPublish(originalAction)
    const props = {
      id: 'about',
      type: 'sitePage',
      draft: {_id: 'drafts.about', _type: 'sitePage', title: 'About us'},
      published: {_id: 'about', _type: 'sitePage', title: 'About'},
    } as DocumentActionProps

    expect(publish(props)?.disabled).toBe(false)
  })
})
