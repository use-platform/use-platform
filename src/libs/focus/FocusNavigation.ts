import { ElementTreeWalker } from './ElementTreeWalker'
import { adjustedTabIndex } from './adjustedTabIndex'
import { isFocusable } from './isFocusable'

enum FocusDirection {
  Backward,
  Forward,
}

export interface FocusNavigationOptions {
  tabbable?: boolean
  wrap?: boolean
  from?: HTMLElement | null
}

export class FocusNavigation {
  private walker: ElementTreeWalker

  constructor(scope: HTMLElement) {
    this.walker = new ElementTreeWalker(scope, (el) => {
      return scope !== el && scope.contains(el) && isFocusable(el)
    })
  }

  private findElement(dir: FocusDirection, predicate: (element: HTMLElement) => boolean) {
    const isForward = dir === FocusDirection.Forward

    for (; this.walker.current; isForward ? this.walker.next() : this.walker.previous()) {
      if (predicate(this.walker.current)) {
        return this.walker.current
      }
    }

    return null
  }

  private findElementWithTabIndex(tabIndex: number, dir: FocusDirection) {
    return this.findElement(dir, (el) => adjustedTabIndex(el) === tabIndex)
  }

  private findFirstElementWithGreaterTabIndex(dir: FocusDirection) {
    return this.findElement(dir, (el) => adjustedTabIndex(el) >= 0)
  }

  private findElementWithGreaterTabIndex(tabIndex: number) {
    let candidateTabIndex = Number.MAX_SAFE_INTEGER
    let candidate: HTMLElement | null = null

    for (; this.walker.current; this.walker.next()) {
      const currentTabIndex = adjustedTabIndex(this.walker.current)

      if (currentTabIndex > tabIndex && (!candidate || currentTabIndex < candidateTabIndex)) {
        candidate = this.walker.current
        candidateTabIndex = currentTabIndex
      }

      // NOTE: the smallest tabIndex was found, but it is larger than the input tabIndex
      if (candidateTabIndex === tabIndex + 1) {
        break
      }
    }

    this.walker.current = candidate

    return candidate
  }

  private findElementWithLowerTabIndex(tabIndex: number) {
    let candidateTabIndex = 0
    let candidate: HTMLElement | null = null

    for (; this.walker.current; this.walker.previous()) {
      const currentTabIndex = adjustedTabIndex(this.walker.current)

      if (currentTabIndex < tabIndex && currentTabIndex > candidateTabIndex) {
        candidate = this.walker.current
        candidateTabIndex = currentTabIndex
      }

      // NOTE: the largest tabIndex was found, but it is smaller than the input tabIndex
      if (candidateTabIndex === tabIndex - 1) {
        break
      }
    }

    this.walker.current = candidate

    return candidate
  }

  private findNextFocusable(tabbable?: boolean) {
    const current = this.walker.current
    const tabIndex = current ? adjustedTabIndex(current) : 0

    if (current) {
      if (!tabbable) {
        return this.walker.next()
      }

      if (tabIndex >= 0) {
        this.walker.next()
        const candidate = this.findElementWithTabIndex(tabIndex, FocusDirection.Forward)

        if (candidate) {
          return candidate
        }
      } else {
        const candidate = this.findFirstElementWithGreaterTabIndex(FocusDirection.Forward)

        if (candidate) {
          return candidate
        }
      }

      if (tabIndex === 0) {
        return null
      }
    }

    this.walker.first()

    if (!tabbable) {
      return this.walker.current
    }

    const candidate = this.findElementWithGreaterTabIndex(tabIndex)
    if (candidate) {
      return candidate
    }

    this.walker.first()

    return this.findElementWithTabIndex(0, FocusDirection.Forward)
  }

  private findPreviousFocusable(tabbable?: boolean) {
    const current = this.walker.current

    if (!current) {
      this.walker.last()
    } else {
      this.walker.previous()
    }

    if (!tabbable) {
      return this.walker.current
    }

    const tabIndex = current ? adjustedTabIndex(current) : 0

    if (tabIndex < 0) {
      const candidate = this.findFirstElementWithGreaterTabIndex(FocusDirection.Backward)

      if (candidate) {
        return candidate
      }
    } else {
      const candidate = this.findElementWithTabIndex(tabIndex, FocusDirection.Backward)

      if (candidate) {
        return candidate
      }
    }

    this.walker.last()

    return this.findElementWithLowerTabIndex(tabIndex > 0 ? tabIndex : Number.MAX_SAFE_INTEGER)
  }

  get scope() {
    return this.walker.root
  }

  get current() {
    return this.walker.current
  }

  next(options: FocusNavigationOptions = {}) {
    const { tabbable, from, wrap } = options

    if (from !== undefined) {
      this.walker.current = from
    }

    const node = this.findNextFocusable(tabbable)

    if (!node && wrap) {
      return this.findNextFocusable(tabbable)
    }

    return node
  }

  previous(options: FocusNavigationOptions = {}) {
    const { tabbable, from, wrap } = options

    if (from !== undefined) {
      this.walker.current = from
    }

    const node = this.findPreviousFocusable(tabbable)

    if (!node && wrap) {
      return this.findPreviousFocusable(tabbable)
    }

    return node
  }

  first(tabbable?: boolean) {
    return this.next({ from: null, tabbable })
  }

  last(tabbable?: boolean) {
    return this.previous({ from: null, tabbable })
  }
}
