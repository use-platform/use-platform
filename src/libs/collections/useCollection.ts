import { useMemo, useRef } from 'react'

import { CollectionBuilder } from './CollectionBuilder'
import { CollectionFactory, CollectionProps } from './types'

export function useCollection<T>(props: CollectionProps, factory: CollectionFactory<T>) {
  const { children } = props
  const factoryRef = useRef(factory)
  factoryRef.current = factory

  return useMemo(() => {
    const builder = new CollectionBuilder()
    const nodes = builder.build({ children })

    return factoryRef.current(nodes)
  }, [children])
}
