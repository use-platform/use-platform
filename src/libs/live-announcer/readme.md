# live-announcer

## Usage

```tsx
import { announce } from '@use-platform/react/libs/live-announcer'
const Example = () => {
  return (
    <>
      <button onClick={() => announce('message')}>Announce</button>
      <button onClick={() => announce('message', 'assertive')}>Announce</button>
    </>
  )
}
```
