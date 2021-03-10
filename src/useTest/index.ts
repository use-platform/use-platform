import { useRef } from 'react'

export function useTest() {
  const ref = useRef(0)

  return ref.current
}
