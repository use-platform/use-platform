export function createDomWalker(root: Node, predicate: (node: Node) => boolean) {
  const acceptNode: NodeFilter['acceptNode'] = (node) => {
    if (predicate(node)) {
      return NodeFilter.FILTER_ACCEPT
    }

    return NodeFilter.FILTER_SKIP
  }

  // IE11 require use function instead object.
  const safeFilter = acceptNode as unknown as NodeFilter
  safeFilter.acceptNode = acceptNode

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT,
    safeFilter,
    // IE11 require last argument
    false,
  )

  return walker
}
