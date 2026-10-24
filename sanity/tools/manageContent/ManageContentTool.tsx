import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Select,
  Stack,
  Text,
  TextInput,
} from '@sanity/ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useClient } from 'sanity'
import { useIntentLink } from 'sanity/router'

type DocType = 'testPassed' | 'page'

interface TestPassedRow {
  _id: string
  skaterName: string
  testType: string
  testLevel: string
  passedDate: string
  distinction?: string
}

interface PageRow {
  _id: string
  title: string
  slug?: string
  route?: string
  isBuiltIn?: boolean
  schemaType?: 'page' | 'sitePage'
}

const BUILT_IN_PAGES = [
  {title: 'Home', route: '/', id: 'site-page-home'},
  {title: 'About', route: '/about', id: 'site-page-about'},
  {title: 'Membership', route: '/membership', id: 'site-page-membership'},
  {title: 'Programs', route: '/programs', id: 'site-page-programs'},
  {title: 'Events', route: '/events', id: 'site-page-events'},
  {title: 'Resources', route: '/resources', id: 'site-page-resources'},
  {title: 'Tests Passed', route: '/tests-passed', id: 'site-page-tests-passed'},
  {title: 'Announcements', route: '/announcements', id: 'site-page-announcements'},
  {title: 'FAQs', route: '/faqs', id: 'site-page-faqs'},
  {title: 'Donate', route: '/donate', id: 'site-page-donate'},
  {title: 'Contact', route: '/contact', id: 'site-page-contact'},
  {title: 'SCSF Coaches', route: '/scsf-coaches', id: 'site-page-scsf-coaches'},
  {title: 'Newsletter Archive', route: '/the-inside-edge-newsletter-archive', id: 'site-page-newsletter-archive'},
]

const TEST_TYPE_LABELS: Record<string, string> = {
  moves: 'Skating Skills',
  freeskate: 'Singles',
  dance: 'Dance',
}

export default function ManageContentTool({docType}: {docType: DocType}) {
  const client = useClient({ apiVersion: '2026-01-14' }).withConfig({perspective: 'drafts'})

  const [query, setQuery] = useState('')
  const [testType, setTestType] = useState('')
  const [rows, setRows] = useState<(TestPassedRow | PageRow)[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const searchRequestId = useRef(0)

  const runSearch = useCallback(async () => {
    const requestId = ++searchRequestId.current
    setLoading(true)
    setError(null)
    try {
      const q = `*${query.trim()}*`
      if (docType === 'testPassed') {
        const result = await client.fetch<TestPassedRow[]>(
          `*[_type == "testPassed" && ($q == "**" || skaterName match $q || testLevel match $q) && ($testType == "" || testType == $testType)]
            | order(uploadedAt desc)[0...50]{
            _id, skaterName, testType, testLevel, passedDate, distinction
          }`,
          { q, testType }
        )
        if (requestId === searchRequestId.current) setRows(result)
      } else {
        const [customPages, builtInDocs] = await Promise.all([client.fetch<PageRow[]>(
          `*[_type == "page" && ($q == "**" || title match $q || slug.current match $q)]
            | order(title asc)[0...50]{
            _id, title, "slug": slug.current
          }`,
          { q }
        ), client.fetch<PageRow[]>(`*[_type == "sitePage"]{_id, title, route}`)])
        const builtInRows = BUILT_IN_PAGES
          .map((page) => {
            const existing = builtInDocs.find((doc) => doc._id.replace(/^drafts\./, '') === page.id)
            return {
              _id: existing?._id ?? page.id,
              title: existing?.title || page.title,
              route: page.route,
              isBuiltIn: true,
              schemaType: 'sitePage' as const,
            }
          })
          .filter((page) => query.trim() === '' || `${page.title} ${page.route}`.toLowerCase().includes(query.trim().toLowerCase()))
        const result = [...builtInRows, ...customPages.map((page) => ({...page, route: `/${page.slug ?? ''}`, schemaType: 'page' as const}))]
        if (requestId === searchRequestId.current) setRows(result)
      }
    } catch (err) {
      if (requestId === searchRequestId.current) {
        setError(err instanceof Error ? err.message : String(err))
      }
    } finally {
      if (requestId === searchRequestId.current) setLoading(false)
    }
  }, [client, docType, query, testType])

  useEffect(() => {
    // Search when the selected content type changes; the async result updates the view.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    runSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docType, testType])

  const handleDelete = useCallback(
    async (id: string, label: string) => {
      const baseId = id.replace(/^drafts\./, '')
      const pageWarning = docType === 'page'
        ? ' If this page is linked from Navigation, remove that menu link too.'
        : ''
      if (!window.confirm(`Permanently delete "${label}"? This can't be undone.${pageWarning}`)) return
      setDeletingId(baseId)
      setMessage(null)
      setError(null)
      try {
        // Delete both the published document and any unpublished draft of it —
        // whichever exists. Sanity's delete mutation is a no-op for an id that
        // doesn't exist, so this is safe to run unconditionally.
        await client.transaction().delete(baseId).delete(`drafts.${baseId}`).commit()
        setRows((prev) => prev.filter((r) => r._id.replace(/^drafts\./, '') !== baseId))
        setMessage(`Deleted "${label}".`)
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setDeletingId(null)
      }
    },
    [client, docType]
  )

  return (
    <Card height="fill" overflow="auto">
      <Container width={3} padding={5} paddingBottom={6}>
        <Stack space={5}>
          <Stack space={3}>
            <Text size={3} weight="bold">
              {docType === 'page' ? 'Manage Pages' : 'Manage Tests Passed'}
            </Text>
            <Text size={1} muted>
              {docType === 'page'
                ? 'Find, create, edit, and remove website pages. Use the full document editor to update page content.'
                : 'Find, create, edit, and remove Tests Passed records. Filter by discipline or search by skater and test level.'}
            </Text>
          </Stack>

          <Card padding={4} radius={2} shadow={1}>
            <Flex gap={3} align="flex-end" wrap="wrap">
              {docType === 'testPassed' && (
                <Box style={{ minWidth: 180 }}>
                  <Stack space={2}>
                    <Text size={1} weight="semibold">Discipline</Text>
                    <Select
                      value={testType}
                      onChange={(e) => {
                        searchRequestId.current += 1
                        setRows([])
                        setLoading(false)
                        setTestType(e.currentTarget.value)
                      }}
                    >
                      <option value="">All disciplines</option>
                      <option value="moves">Skating Skills</option>
                      <option value="freeskate">Singles</option>
                      <option value="dance">Dance</option>
                    </Select>
                  </Stack>
                </Box>
              )}
              <Box flex={1} style={{ minWidth: 200 }}>
                <Stack space={2}>
                  <Text size={1} weight="semibold">Search</Text>
                  <TextInput
                    placeholder={docType === 'testPassed' ? 'Skater name or test level…' : 'Page title or URL…'}
                    value={query}
                    onChange={(e) => {
                      searchRequestId.current += 1
                      setRows([])
                      setLoading(false)
                      setQuery(e.currentTarget.value)
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && runSearch()}
                  />
                </Stack>
              </Box>
              <Flex gap={2} align="center">
                <CreateButton docType={docType} />
                <Button text="Search" tone="primary" onClick={runSearch} disabled={loading} />
              </Flex>
            </Flex>
          </Card>

          {error && (
            <Card padding={3} radius={2} tone="critical">
              <Text size={1}>{error}</Text>
            </Card>
          )}
          {message && (
            <Card padding={3} radius={2} tone="positive">
              <Text size={1}>{message}</Text>
            </Card>
          )}

          <Card radius={2} shadow={1} overflow="auto">
            <Box as="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {docType === 'testPassed' ? (
                    <>
                      <th style={headerCellStyle}>Skater</th>
                      <th style={headerCellStyle}>Level</th>
                      <th style={headerCellStyle}>Type</th>
                      <th style={headerCellStyle}>Date</th>
                    </>
                  ) : (
                    <>
                      <th style={headerCellStyle}>Title</th>
                      <th style={headerCellStyle}>Website URL</th>
                    </>
                  )}
                  <th style={headerCellStyle}></th>
                  <th style={headerCellStyle}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row._id}>
                    {docType === 'testPassed' ? (
                      <>
                        <td style={cellStyle}><Text size={1}>{(row as TestPassedRow).skaterName}</Text></td>
                        <td style={cellStyle}>
                          <Text size={1}>
                            {(row as TestPassedRow).testLevel}
                            {(row as TestPassedRow).distinction === 'honors' ? ' *' : (row as TestPassedRow).distinction === 'distinction' ? ' **' : ''}
                          </Text>
                        </td>
                        <td style={cellStyle}>
                          <Badge tone="default">
                            {TEST_TYPE_LABELS[(row as TestPassedRow).testType] ?? (row as TestPassedRow).testType}
                          </Badge>
                        </td>
                        <td style={cellStyle}><Text size={1} muted>{(row as TestPassedRow).passedDate}</Text></td>
                      </>
                    ) : (
                      <>
                        <td style={cellStyle}><Text size={1}>{(row as PageRow).title}</Text></td>
                        <td style={cellStyle}><Text size={1} muted>{(row as PageRow).route || `/${(row as PageRow).slug}`}</Text></td>
                      </>
                    )}
                    <td style={{ ...cellStyle, textAlign: 'right' }}>
                      <EditButton
                        docType={docType === 'page' ? ((row as PageRow).schemaType || 'page') : docType}
                        id={row._id.replace(/^drafts\./, '')}
                        isBuiltIn={docType === 'page' && Boolean((row as PageRow).isBuiltIn)}
                      />
                    </td>
                    <td style={{ ...cellStyle, textAlign: 'right' }}>
                      {(row as PageRow).isBuiltIn ? <Text size={1} muted>Built-in page</Text> : <Button
                        text={deletingId === row._id.replace(/^drafts\./, '') ? 'Deleting…' : 'Delete'}
                        tone="critical"
                        mode="ghost"
                        fontSize={1}
                        disabled={deletingId === row._id.replace(/^drafts\./, '')}
                        onClick={() =>
                          handleDelete(
                            row._id,
                            docType === 'testPassed'
                              ? `${(row as TestPassedRow).skaterName} — ${(row as TestPassedRow).testLevel}`
                              : (row as PageRow).title
                          )
                        }
                      />}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={docType === 'testPassed' ? 6 : 4} style={cellStyle}>
                      <Text size={1} muted>No results.</Text>
                    </td>
                  </tr>
                )}
              </tbody>
            </Box>
          </Card>
        </Stack>
      </Container>
    </Card>
  )
}

function CreateButton({docType}: {docType: DocType}) {
  const {href, onClick} = useIntentLink({intent: 'create', params: {type: docType}})
  return <Button as="a" href={href} onClick={onClick} text={docType === 'page' ? 'Add page' : 'Add test record'} tone="positive" />
}

function EditButton({docType, id, isBuiltIn = false}: {docType: DocType | 'sitePage'; id: string; isBuiltIn?: boolean}) {
  const {href, onClick} = useIntentLink({intent: 'edit', params: {id, type: docType}})
  if (isBuiltIn) {
    return <Button as="a" href={`/studio/structure/pages;website-pages;${id}`} text="Edit" mode="ghost" fontSize={1} />
  }
  return <Button as="a" href={href} onClick={onClick} text="Edit" mode="ghost" fontSize={1} />
}

const cellStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 16px',
  borderBottom: '1px solid var(--card-border-color)',
}

const headerCellStyle: React.CSSProperties = {
  ...cellStyle,
  paddingTop: 12,
  paddingBottom: 12,
}
