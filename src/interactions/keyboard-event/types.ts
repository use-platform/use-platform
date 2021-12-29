export interface UseKeyBindingProps {
  bind: string
  onAction: (event: KeyboardEvent) => void
  disabled?: boolean
}
