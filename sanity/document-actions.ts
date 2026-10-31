import type {DocumentActionComponent} from 'sanity'
import {hasPublishableChanges} from '@/lib/document-diff'

/** Keep Sanity's normal publish permissions/validation, but disable no-op publishes. */
export function disableNoopPublish(
  originalAction: DocumentActionComponent,
): DocumentActionComponent {
  const PublishWithDiffCheck: DocumentActionComponent = (props) => {
    const result = originalAction(props)
    if (!result || !props.published) return result

    const hasChanges = hasPublishableChanges(props.draft, props.published)
    return {
      ...result,
      disabled: result.disabled || !hasChanges,
      title: !hasChanges ? 'There are no changes to publish' : result.title,
    }
  }

  PublishWithDiffCheck.action = originalAction.action
  PublishWithDiffCheck.displayName = 'PublishWithDiffCheck'
  return PublishWithDiffCheck
}
