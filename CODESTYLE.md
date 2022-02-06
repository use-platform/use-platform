# Codestyle

This document describe code style of current project and can be modified by members of development.

## Table of contents

- [Structure](#structure)
- [Boolean flags](#boolean-flags)
- [Interfaces](#interfaces)
- [Examples](#examples)

## Structure

Each component or library should have similar structure:

- `useComponentState` — Hook for implement state
- `useComponent` — Hook for implement semantic
- `index` — Public api (necessary for each component or library)
- `types` — Shared types
- `utils` — Shared utils (can be folder or single file)
- `__examples__` — Storybook examples
- `__tests__` — Unit tests (can be located outside folder)

## Boolean flags

All boolean flags (exclude DOM props) should have prefix `is`:

```ts
export function useComponentState() {
  return {
    isDisabled: true,
  }
}

export function useComponent(props, state) {
  return {
    // DOM props should not have `is` prefix.
    inputProps: {
      disabled: state.isDiabled,
    },
  }
}
```

## Interfaces

Interfaces have several groups:

- `Shared` — Shared interfaces can be used in base or props.
- `Base` — Base interfaces can be used in props or components.
- `Props` — Props interfaces can be used in props (hooks only).
- `Result` — Result interfaces can be used in result props (hooks only).

```tsx
interface SharedComponentProps {
  value: string
  onChange: (value?: string) => void
}

interface UseComponentProps extends SharedComponentProps {
  disabled?: boolean
}

interface UseComponentResult {
  inputProps: HTMLAttributes<HTMLInputElement>
}

function useComponent(props: UseComponentProps): UseComponentResult {
  return {
    inputProps: {},
  }
}
```

## Examples

All examples of component should be exported from `index.examples` file:

```tsx
import { Meta } from '@storybook/react'
export * from './default'
export default { title: 'semantic/button' } as Meta
```

Each example should haven't external dependencies (for possible open in codesandbox):

```tsx
import { FC, useRef } from 'react'
import { useButton, useHover } from '@use-platform/react'

// Example (should be exported)
export const Default = () => {
  return <Button />
}

// Example component (should be not exported)
const Button: FC = () => {...}
```
