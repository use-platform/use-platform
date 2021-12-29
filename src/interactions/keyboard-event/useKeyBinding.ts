import { useEffect, useRef } from 'react'

import { UseKeyBindingProps } from './types'

export function useKeyBinding(props: UseKeyBindingProps): void {
  const { bind, onAction, disabled } = props
  const partialPropsRef = useRef<Pick<UseKeyBindingProps, 'onAction'>>({ onAction })

  partialPropsRef.current.onAction = onAction

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (bind === event.code) {
        partialPropsRef.current.onAction(event)
      }
    }

    if (!disabled) {
      document.addEventListener('keyup', listener)
    }

    return () => {
      document.removeEventListener('keyup', listener)
    }
  }, [disabled, bind])
}
