import { UseOutsideClickTriggerStrategy, useOutsideClick } from '@use-platform/react'
import { useRef, useState } from 'react'

interface DefaultArgs {
  triggerStrategy: UseOutsideClickTriggerStrategy
  disabled: boolean
}

export const Default = (args: DefaultArgs) => {
  const { triggerStrategy, disabled } = args
  const unclickableRef = useRef(null)
  const [events, setEvents] = useState<string[]>([])
  const onAction = (event: Event) => {
    setEvents(events.concat(`Event with type '${event.type}', timestamp: ${Date.now()}`))
  }
  useOutsideClick({ refs: [unclickableRef], onAction, triggerStrategy, disabled })

  return (
    <div>
      <div ref={unclickableRef}>Unclickable area</div>
      {events.length === 0 && <div>No events were detected yet</div>}
      {events.map((event) => (
        <div key={event}>{event}</div>
      ))}
    </div>
  )
}

Default.args = {
  triggerStrategy: 'pressup',
  disabled: false,
} as DefaultArgs

Default.argTypes = {
  triggerStrategy: {
    options: ['pressup', 'pressdown'] as UseOutsideClickTriggerStrategy[],
    control: { type: 'select' },
  },
}
