type Fn = (...args: any[]) => any

export function chainFn<T extends Fn>(...callbacks: T[]): T {
  return ((...args: any[]) => {
    for (const callback of callbacks) {
      if (typeof callback === 'function') {
        callback(...args)
      }
    }
  }) as T
}
