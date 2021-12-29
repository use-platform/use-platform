import { useCallback, useState } from '@storybook/addons'
import { useKeyBinding } from '@yandex/web-platform'

interface DefaultArgs {
  bind: string
  disabled: boolean
}

export const Default = (args: DefaultArgs) => {
  const { bind, disabled } = args
  const [events, setEvents] = useState<string[]>([])
  const onAction = useCallback(
    (event: KeyboardEvent) => {
      setEvents(events.concat(`Key: ${event.code}, timestamp: ${Date.now()}`))
    },
    [events],
  )
  useKeyBinding({ bind, disabled, onAction: onAction })

  return (
    <div>
      {events.length === 0 && <div>No events were detected yet</div>}
      {events.map((ev) => (
        <div key={ev}>{ev}</div>
      ))}
    </div>
  )
}

Default.args = {
  bind: 'Space',
  disabled: false,
}
