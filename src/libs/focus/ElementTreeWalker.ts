import { createDomWalker } from './utils'

export class ElementTreeWalker {
  private walker: TreeWalker

  private currentElement: HTMLElement | null

  constructor(root: HTMLElement, filter: (node: HTMLElement) => boolean) {
    this.walker = createDomWalker(root, (node) => filter(node as HTMLElement))
    this.currentElement = null
  }

  /**
   * Get root element
   */
  get root() {
    return this.walker.root as HTMLElement
  }

  /**
   * Get current element
   */
  get current() {
    return this.currentElement === this.root ? null : this.currentElement
  }

  /**
   * Set current element
   */
  set current(node: HTMLElement | null) {
    const current = this.root.contains(node) ? node : null

    this.currentElement = current
    this.walker.currentNode = current ?? this.root
  }

  /**
   * Move to first element of root
   */
  first() {
    this.walker.currentNode = this.walker.root

    return this.next()
  }

  /**
   * Move to last element of root
   */
  last() {
    this.walker.currentNode = this.walker.root
    let descendant: HTMLElement | null = null

    while (this.walker.lastChild()) {
      descendant = this.walker.currentNode as HTMLElement | null
    }

    this.currentElement = descendant

    return descendant
  }

  /**
   * Move to next element of root
   */
  next() {
    this.currentElement = this.walker.nextNode() as HTMLElement | null

    return this.currentElement
  }

  /**
   * Move to previous element of root
   */
  previous() {
    const previous = this.walker.previousNode() as HTMLElement | null

    this.currentElement = previous === this.root ? null : previous

    return this.currentElement
  }
}
