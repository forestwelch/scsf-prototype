import { EditIcon } from '@sanity/icons'
import type { Tool } from 'sanity'

import ManageContentTool from './ManageContentTool'

export function managePagesTool(): Tool {
  return {
    name: 'manage-pages',
    title: 'Manage Pages',
    icon: EditIcon,
    component: () => <ManageContentTool docType="page" />,
  }
}

export function manageTestsPassedTool(): Tool {
  return {
    name: 'manage-tests-passed',
    title: 'Manage Tests Passed',
    icon: EditIcon,
    component: () => <ManageContentTool docType="testPassed" />,
  }
}
