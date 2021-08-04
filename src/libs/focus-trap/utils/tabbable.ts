import { ElementTreeWalker, isTabbable, adjustedTabIndex } from '../../focus'

interface TabbableNode {
  index: number
  tabIndex: number
  node: HTMLElement
}

export function getTabbables(root: HTMLElement, filter?: (node: HTMLElement) => boolean) {
  const walker = new ElementTreeWalker(root, (node) => {
    const tabbable = isTabbable(node)

    if (filter && tabbable) {
      return filter(node)
    }

    return tabbable
  })

  const nodes: TabbableNode[] = []
  const regular: HTMLElement[] = []

  let index = 0
  let node: HTMLElement | null = null
  while ((node = walker.next())) {
    const tabIndex = adjustedTabIndex(node)

    if (tabIndex === 0) {
      regular.push(node)
    } else {
      nodes.push({
        index: index++,
        tabIndex,
        node,
      })
    }
  }

  return nodes
    .sort((a, b) => (a.tabIndex === b.tabIndex ? a.index - b.index : a.tabIndex - b.tabIndex))
    .map((v) => v.node)
    .concat(regular)
}
