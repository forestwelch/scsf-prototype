import { TrashIcon } from '@sanity/icons'
import type { Tool } from 'sanity'

import ManageContentTool from './ManageContentTool'

export function manageContentTool(): Tool {
  return {
    name: 'manage-content',
    title: 'Delete Content',
    icon: TrashIcon,
    component: ManageContentTool,
  }
}
