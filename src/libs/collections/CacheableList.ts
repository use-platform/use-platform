export class CacheableList<T> implements Iterable<T> {
  private cache: T[] | null = null

  private factory: () => Iterable<T>

  constructor(factory: () => Iterable<T>) {
    this.factory = factory
  }

  *[Symbol.iterator]() {
    if (this.cache === null) {
      this.cache = []

      for (const item of this.factory()) {
        this.cache.push(item)

        yield item
      }

      return
    }

    for (const item of this.cache) {
      yield item
    }
  }
}
