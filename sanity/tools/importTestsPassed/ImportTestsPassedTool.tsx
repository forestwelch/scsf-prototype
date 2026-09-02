import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Flex,
  Select,
  Stack,
  Text,
  TextInput,
} from '@sanity/ui'
import { useCallback, useMemo, useState } from 'react'
import { useClient } from 'sanity'

import { type Distinction, type ParsedRow, parseWorkbookFile, type TestType } from './parse'

const TEST_TYPE_OPTIONS: { value: TestType; title: string }[] = [
  { value: 'moves', title: 'Moves in the Field' },
  { value: 'freeskate', title: 'Free Skate' },
  { value: 'dance', title: 'Dance' },
  { value: 'pairs', title: 'Pairs' },
]

const DISTINCTION_LABEL: Record<Distinction, string> = {
  none: '—',
  honors: 'Honors (*)',
  distinction: 'Distinction (**)',
}

interface Row extends ParsedRow {
  key: string
  include: boolean
}

function slugPart(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function ImportTestsPassedTool() {
  const client = useClient({ apiVersion: '2024-01-01' })

  const [fileName, setFileName] = useState<string | null>(null)
  const [rows, setRows] = useState<Row[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [parseError, setParseError] = useState<string | null>(null)
  const [batchDate, setBatchDate] = useState('')
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ imported: number } | null>(null)
  const [importError, setImportError] = useState<string | null>(null)

  const includedCount = useMemo(() => rows.filter((r) => r.include).length, [rows])

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name)
    setParseError(null)
    setResult(null)
    setImportError(null)
    setRows([])
    setWarnings([])
    try {
      const { rows: parsed, warnings: w } = await parseWorkbookFile(file)
      if (parsed.length === 0) {
        setParseError(w[0] || 'No rows found in this file.')
        return
      }
      setRows(
        parsed.map((r, i) => ({
          ...r,
          key: `${i}-${r.skaterName}-${r.testLevel}`,
          include: true,
        }))
      )
      setWarnings(w)
    } catch (err) {
      setParseError(err instanceof Error ? err.message : String(err))
    }
  }, [])

  const onFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const updateRow = useCallback((key: string, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)))
  }, [])

  const canImport = includedCount > 0 && /^\d{4}-\d{2}-\d{2}$/.test(batchDate) && !importing

  const handleImport = useCallback(async () => {
    if (!canImport) return
    setImporting(true)
    setImportError(null)
    setResult(null)
    try {
      const toImport = rows.filter((r) => r.include)
      const seen = new Map<string, number>()

      const docs = toImport.map((r) => {
        const base = `import-${batchDate}-${slugPart(r.skaterName)}-${slugPart(r.testLevel)}-${r.testType}`
        const n = seen.get(base) ?? 0
        seen.set(base, n + 1)
        return {
          _id: `${base}-${n}`,
          _type: 'testPassed' as const,
          skaterName: r.skaterName,
          testType: r.testType,
          testLevel: r.testLevel,
          passedDate: batchDate,
          distinction: r.distinction,
        }
      })

      const BATCH = 100
      let imported = 0
      for (let i = 0; i < docs.length; i += BATCH) {
        const batch = docs.slice(i, i + BATCH)
        const tx = client.transaction()
        batch.forEach((doc) => tx.createOrReplace(doc))
        await tx.commit()
        imported += batch.length
      }

      setResult({ imported })
    } catch (err) {
      setImportError(err instanceof Error ? err.message : String(err))
    } finally {
      setImporting(false)
    }
  }, [canImport, rows, batchDate, client])

  const reset = useCallback(() => {
    setFileName(null)
    setRows([])
    setWarnings([])
    setParseError(null)
    setResult(null)
    setImportError(null)
    setBatchDate('')
  }, [])

  return (
    <Card height="fill" overflow="auto">
      <Container width={3} padding={5} paddingBottom={6}>
        <Stack space={5}>
          <Stack space={3}>
            <Text size={3} weight="bold">
              Import Tests Passed
            </Text>
            <Text size={1} muted>
              Upload the &ldquo;Tests Passed&rdquo; spreadsheet exported for a test session. Each row needs
              a &ldquo;Skater&rdquo; and a &ldquo;Test Name&rdquo; column — a trailing * marks Honors, ** marks
              Distinction. Review the parsed rows below, set the date for this batch, then import.
            </Text>
          </Stack>

          <Card padding={4} radius={2} shadow={1}>
            <Stack space={4}>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={onFileInputChange}
                disabled={importing}
              />
              {fileName && <Text size={1} muted>Loaded: {fileName}</Text>}
              {parseError && (
                <Card padding={3} radius={2} tone="critical">
                  <Text size={1}>{parseError}</Text>
                </Card>
              )}
              {warnings.length > 0 && (
                <Card padding={3} radius={2} tone="caution">
                  <Stack space={2}>
                    {warnings.map((w, i) => (
                      <Text size={1} key={i}>{w}</Text>
                    ))}
                  </Stack>
                </Card>
              )}
            </Stack>
          </Card>

          {rows.length > 0 && (
            <>
              <Card padding={4} radius={2} shadow={1}>
                <Flex align="center" gap={4}>
                  <Box flex={1}>
                    <Stack space={3}>
                      <Text size={1} weight="semibold">Date passed for this batch</Text>
                      <TextInput
                        type="date"
                        value={batchDate}
                        onChange={(e) => setBatchDate(e.currentTarget.value)}
                        disabled={importing}
                      />
                    </Stack>
                  </Box>
                  <Badge tone="primary">{includedCount} of {rows.length} rows selected</Badge>
                </Flex>
              </Card>

              <Card radius={2} shadow={1} overflow="auto">
                <Box as="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={headerCellStyle}></th>
                      <th style={headerCellStyle}>Row</th>
                      <th style={headerCellStyle}>Skater</th>
                      <th style={headerCellStyle}>Test</th>
                      <th style={headerCellStyle}>Type</th>
                      <th style={headerCellStyle}>Distinction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.key} style={{ opacity: r.include ? 1 : 0.4 }}>
                        <td style={cellStyle}>
                          <Checkbox
                            checked={r.include}
                            onChange={() => updateRow(r.key, { include: !r.include })}
                            disabled={importing}
                          />
                        </td>
                        <td style={cellStyle}><Text size={1} muted>{r.rowNum}</Text></td>
                        <td style={cellStyle}><Text size={1}>{r.skaterName}</Text></td>
                        <td style={cellStyle}><Text size={1}>{r.testLevel}</Text></td>
                        <td style={cellStyle}>
                          <Select
                            value={r.testType}
                            onChange={(e) =>
                              updateRow(r.key, { testType: e.currentTarget.value as TestType })
                            }
                            disabled={importing}
                            fontSize={1}
                          >
                            {TEST_TYPE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.title}</option>
                            ))}
                          </Select>
                        </td>
                        <td style={cellStyle}>
                          <Text size={1}>{DISTINCTION_LABEL[r.distinction]}</Text>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Box>
              </Card>

              <Flex gap={3} align="center" paddingY={1}>
                <Button
                  text={importing ? 'Importing…' : `Import ${includedCount} test${includedCount === 1 ? '' : 's'}`}
                  tone="positive"
                  disabled={!canImport}
                  onClick={handleImport}
                />
                <Button text="Start over" mode="ghost" onClick={reset} disabled={importing} />
                {!batchDate && (
                  <Text size={1} muted>Pick a date above to enable import.</Text>
                )}
              </Flex>

              {importError && (
                <Card padding={4} radius={2} tone="critical">
                  <Text size={1}>Import failed: {importError}</Text>
                </Card>
              )}
              {result && (
                <Card padding={4} radius={2} tone="positive">
                  <Text size={1}>
                    Imported {result.imported} test{result.imported === 1 ? '' : 's'} dated {batchDate}.
                    Re-importing the same file for the same date will update, not duplicate, these
                    records. Check Studio → Tests Passed to verify.
                  </Text>
                </Card>
              )}
            </>
          )}
        </Stack>
      </Container>
    </Card>
  )
}

const cellStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 16px',
  borderBottom: '1px solid var(--card-border-color)',
  whiteSpace: 'nowrap',
}

const headerCellStyle: React.CSSProperties = {
  ...cellStyle,
  paddingTop: 12,
  paddingBottom: 12,
}
