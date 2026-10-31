type DocumentShape = Record<string, unknown> & {_id?: string; _rev?: string; _createdAt?: string; _updatedAt?: string}

const volatileDocumentKeys = new Set(['_id', '_rev', '_createdAt', '_updatedAt'])

function normalize(value: unknown, root = false): unknown {
  if (Array.isArray(value)) return value.map((item) => normalize(item))
  if (!value || typeof value !== 'object') return value

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !root || !volatileDocumentKeys.has(key))
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => [key, normalize(nested)])
  )
}

/** Compare document content while ignoring Sanity's revision and timestamp metadata. */
export function hasPublishableChanges(
  draft: DocumentShape | null | undefined,
  published: DocumentShape | null | undefined,
): boolean {
  if (!draft) return false
  if (!published) return true
  return JSON.stringify(normalize(draft, true)) !== JSON.stringify(normalize(published, true))
}
