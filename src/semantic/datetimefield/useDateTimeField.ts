import { HTMLAttributes } from 'react'

import { usePress } from '../../interactions/press'
import { useFocusManager } from '../../libs/focus'
import { useUniqId } from '../../libs/uniq-id'
import { AriaLabelingProps } from '../../shared/types'

export interface UseDateTimeFieldProps extends AriaLabelingProps {
  id?: string
  'aria-controls'?: string
  'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
  'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling'
}

export interface UseDateTimeFieldResult {
  fieldProps: HTMLAttributes<HTMLElement>
  segmentProps: HTMLAttributes<HTMLElement>
}

export function useDateTimeField(props: UseDateTimeFieldProps): UseDateTimeFieldResult {
  const { focusNext } = useFocusManager()

  const id = useUniqId(props.id)
  const { pressProps } = usePress({
    onPressStart: (event) => {
      const { currentTarget, target, source } = event
      const { activeElement } = document

      if (source === 'keyboard') {
        return
      }

      if (
        !currentTarget.contains(activeElement) ||
        (target !== activeElement && target !== currentTarget)
      ) {
        focusNext({ from: target as HTMLElement, tabbable: true })
      }
    },
  })

  const fieldProps: HTMLAttributes<HTMLElement> = {
    ...pressProps,
    role: 'group',
    id,
    'aria-label': props['aria-label'],
    'aria-labelledby': props['aria-labelledby'],
  }

  const segmentProps: HTMLAttributes<HTMLElement> = {
    'aria-controls': props['aria-controls'],
    'aria-haspopup': props['aria-haspopup'],
    'aria-invalid': props['aria-invalid'],
    'aria-labelledby': fieldProps['aria-labelledby'] || fieldProps.id,
  }

  return {
    fieldProps,
    segmentProps,
  }
}
