import { EditIcon } from '@sanity/icons'
import type { Tool } from 'sanity'

import ManageContentTool from './ManageContentTool'

export function manageContentTool(): Tool {
  return {
    name: 'manage-content',
    title: 'Manage Content',
    icon: EditIcon,
    component: ManageContentTool,
  }
}
