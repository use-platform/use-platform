import { CloseStrategy, useOverlay } from '@yandex/web-platform'
import { forwardRef, useRef, useState } from 'react'

interface DeafultArgs {
  visible: boolean
  closeStrategy: CloseStrategy
}

interface PopupProps {
  visible: boolean
}

const Popup = forwardRef<HTMLDivElement, PopupProps>((props, ref) => {
  return props.visible ? <div ref={ref}>I am popup!</div> : null
})
export const Default = (args: DeafultArgs) => {
  const popupRef = useRef(null)
  const [oldPropVisiblity, setOldPropVisiblity] = useState<boolean | null>(null)
  const [isVisible, setIsVisible] = useState<boolean | null>(null)
  if (args.visible !== oldPropVisiblity) {
    setOldPropVisiblity(args.visible)
    setIsVisible(args.visible)
  }
  useOverlay({
    visible: args.visible,
    essentialRefs: [popupRef],
    unsafe_strategy: args.closeStrategy,
    onClose: () => setIsVisible(false),
  })

  return <Popup visible={isVisible as boolean} ref={popupRef} />
}

Default.args = {
  visible: false,
  closeStrategy: 'pressup',
} as DeafultArgs

Default.argTypes = {
  closeStrategy: {
    options: ['pressup', 'pressdown'] as CloseStrategy[],
    control: { type: 'select' },
  },
}
