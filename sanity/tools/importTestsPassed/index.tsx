import { UploadIcon } from '@sanity/icons'
import type { Tool } from 'sanity'

import ImportTestsPassedTool from './ImportTestsPassedTool'

export function importTestsPassedTool(): Tool {
  return {
    name: 'import-tests-passed',
    title: 'Import Tests Passed',
    icon: UploadIcon,
    component: ImportTestsPassedTool,
  }
}
