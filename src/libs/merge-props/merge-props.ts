import type { TupleTypes, UnionToIntersection } from '../utility-types'
import { chainFn } from './utils/chain-fn'
import { isFn } from './utils/is-fn'

type Props = Record<string, any>

export function mergeProps<T extends Props[]>(...args: T): UnionToIntersection<TupleTypes<T>> {
  const result: Props = {}

  for (const props of args) {
    for (const key in result) {
      if (/^on[A-Z]/.test(key) && isFn(props[key]) && isFn(result[key])) {
        result[key] = chainFn(result[key], props[key])
      } else if (key === 'aria-labelledby' && props[key] && result[key]) {
        const currentPropValues = (result[key] as string).split(' ')
        if (!currentPropValues.includes(props[key])) {
          currentPropValues.push(props[key])
        }
        result[key] = currentPropValues.join(' ')
      } else {
        result[key] = props[key] !== undefined ? props[key] : result[key]
      }
    }

    // Add props from b that are not in a
    for (const key in props) {
      if (result[key] === undefined) {
        result[key] = props[key]
      }
    }
  }

  return result as UnionToIntersection<TupleTypes<T>>
}
