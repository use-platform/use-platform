export type AriaLivePriority = 'assertive' | 'polite'

const PRIORITIES: AriaLivePriority[] = ['assertive', 'polite']

class LiveAnnouncer {
  private liveRegions: Partial<Record<AriaLivePriority, HTMLElement>> = {}

  private lastMessage?: string

  announce(message: string, priority: AriaLivePriority) {
    const liveRegion = this.getLiveRegion(priority)

    const announceMessage = this.lastMessage === message ? `${message}\xa0` : message

    if (message) {
      this.lastMessage = announceMessage
    }

    liveRegion.textContent = announceMessage
  }

  dispose() {
    PRIORITIES.forEach((priority) => {
      const liveRegion = this.liveRegions[priority]

      if (liveRegion) {
        document.body.removeChild(liveRegion)
      }
    })

    this.liveRegions = {}
  }

  private getLiveRegion(priority: AriaLivePriority) {
    const liveRegion = this.liveRegions[priority]

    if (!liveRegion) {
      const node = document.createElement('div')
      node.setAttribute('aria-live', priority)
      node.setAttribute('aria-atomic', 'true')

      Object.assign(node.style, {
        border: 0,
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        margin: '0 -1px -1px 0',
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        width: 1,
        whiteSpace: 'nowrap',
      })

      this.liveRegions[priority] = node
      document.body.appendChild(node)

      return node
    }

    return liveRegion
  }
}

let liveAnnouncer: LiveAnnouncer | null = null

/**
 * Cause a message to be announced by screen readers.
 *
 * @param message The message that should be announced.
 * @param priority The priority with which screen reader should treat updates. Default: `polite`
 */
export function announce(message: string, priority: AriaLivePriority = 'polite') {
  if (!liveAnnouncer) {
    liveAnnouncer = new LiveAnnouncer()
  }

  liveAnnouncer.announce(message, priority)
}

export function disposeLiveAnnouncer() {
  if (liveAnnouncer) {
    liveAnnouncer.dispose()
    liveAnnouncer = null
  }
}
