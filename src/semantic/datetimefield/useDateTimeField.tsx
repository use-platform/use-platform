import { AriaAttributes, HTMLAttributes } from 'react'

import { usePress } from '../../interactions/press'
import { AriaLabelingProps } from '../../shared/types'
import { useFocusManager } from '../../libs/focus'
import { useUniqId } from '../../libs/uniq-id'

export interface UseDateTimeFieldProps
  extends AriaLabelingProps,
    Pick<AriaAttributes, 'aria-controls' | 'aria-haspopup' | 'aria-invalid'> {
  id?: string
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

      if (source !== 'mouse') {
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
