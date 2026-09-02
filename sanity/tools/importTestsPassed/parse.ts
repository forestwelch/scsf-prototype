/**
 * Parsing logic for the "Import Tests Passed" Studio tool.
 *
 * The classification rules here (dance pattern list, honors/distinction
 * marker convention) are intentionally kept in sync with
 * scripts/migrate-tests-passed.mjs, which used the same rules against the
 * old WordPress tables. Keep the two in sync if the club's naming
 * conventions change.
 */
import * as XLSX from 'xlsx'

export type TestType = 'moves' | 'freeskate' | 'dance' | 'pairs'
export type Distinction = 'none' | 'honors' | 'distinction'

export interface ParsedRow {
  rowNum: number
  skaterName: string
  testLevel: string
  testType: TestType
  distinction: Distinction
}

export interface ParseResult {
  rows: ParsedRow[]
  warnings: string[]
}

const DANCE_PATTERNS = [
  'dutch waltz', 'canasta tango', 'rhythm blues', 'cha cha', 'fiesta tango',
  'swing dance', 'hickory hoedown', 'european waltz', 'foxtrot', 'american waltz',
  'tango', 'kilian', 'killian', 'blues', 'paso doble', 'march', 'viennese waltz',
  'quickstep', 'rhumba', 'rocker foxtrot', 'starlight waltz', 'ten-fox', 'ten fox',
  'westminster waltz', 'argentine tango', 'austrian waltz', 'silver samba',
  'gold rhumba', 'ravensburger waltz', 'silver sterling tango', "queen's",
  'midnight blues', 'golden waltz', 'preliminary dance', 'pre-bronze dance',
  'bronze dance', 'silver dance', 'gold dance', 'international dance',
  'adult bronze dance', 'adult silver dance',
]

export function classifyTestType(testName: string): TestType {
  const lower = testName.toLowerCase()

  if (lower.includes('pairs') || lower.includes('pair ')) return 'pairs'

  if (lower.includes('dance') || lower.includes('solo')) return 'dance'
  for (const pattern of DANCE_PATTERNS) {
    if (lower.includes(pattern)) return 'dance'
  }

  if (lower.includes('skating skills') || lower.includes('moves in the field')) return 'moves'

  if (
    lower.includes('singles') ||
    lower.includes('free skate') ||
    lower.includes('freeskate') ||
    lower.includes('free') ||
    lower.includes('short program') ||
    lower.includes('long program')
  ) return 'freeskate'

  return 'moves'
}

// Strips a trailing */** distinction marker off a cell's text.
// Legend: * = With Honors, ** = With Distinction.
function splitDistinction(raw: string): { text: string; distinction: Distinction } {
  const match = raw.match(/(\*{1,2})\s*$/)
  const text = raw.replace(/\*+\s*$/, '').trim()
  let distinction: Distinction = 'none'
  if (match) {
    distinction = match[1].length >= 2 ? 'distinction' : 'honors'
  }
  return { text, distinction }
}

function findColumn(header: string[], pattern: RegExp): number {
  return header.findIndex((cell) => pattern.test(cell.trim()))
}

export async function parseWorkbookFile(file: File): Promise<ParseResult> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) {
    return { rows: [], warnings: ['The workbook has no sheets.'] }
  }
  const sheet = workbook.Sheets[sheetName]
  const raw: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })

  const warnings: string[] = []
  if (raw.length === 0) {
    return { rows: [], warnings: ['The sheet is empty.'] }
  }

  const header = raw[0].map((c) => String(c ?? ''))
  const skaterCol = findColumn(header, /skater|name/i)
  const testCol = findColumn(header, /test/i)

  if (skaterCol === -1 || testCol === -1) {
    return {
      rows: [],
      warnings: [
        `Couldn't find "Skater" and "Test Name" columns in the header row (found: ${header.join(', ') || '(blank)'}).`,
      ],
    }
  }

  const rows: ParsedRow[] = []
  for (let i = 1; i < raw.length; i++) {
    const line = raw[i]
    const skaterCellRaw = String(line[skaterCol] ?? '').trim()
    const testCellRaw = String(line[testCol] ?? '').trim()
    if (!skaterCellRaw && !testCellRaw) continue // blank row
    if (!skaterCellRaw || !testCellRaw) {
      warnings.push(`Row ${i + 1}: missing skater name or test name — skipped.`)
      continue
    }

    // The */** marker is usually on the test name, but some legacy exports
    // put it on the skater name instead — check both.
    const fromTest = splitDistinction(testCellRaw)
    const fromSkater = splitDistinction(skaterCellRaw)

    rows.push({
      rowNum: i + 1,
      skaterName: fromSkater.text,
      testLevel: fromTest.text,
      testType: classifyTestType(fromTest.text),
      distinction: fromTest.distinction !== 'none' ? fromTest.distinction : fromSkater.distinction,
    })
  }

  return { rows, warnings }
}
