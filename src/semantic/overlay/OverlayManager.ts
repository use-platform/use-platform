import { CloseStrategy, OverlayOptions, RefHTMLElement } from './types'

const overlays: OverlayOptions[] = []
let eventTarget: HTMLElement | null = null
let activeOverlay: OverlayOptions | null | undefined = null

function getTopOverlayOptions(): OverlayOptions | undefined {
  return overlays[overlays.length - 1]
}

function isEssentionalClick(refs: RefHTMLElement[], target: HTMLElement | null) {
  return refs.some((ref) => {
    return ref.current instanceof HTMLElement && ref.current.contains(target)
  })
}

function handleClose(
  event: KeyboardEvent | MouseEvent,
  source: 'esc' | 'click',
  strategy?: CloseStrategy,
): void {
  const options = getTopOverlayOptions()

  if (!options || !options.onClose || (strategy && strategy !== options.closeStrategy)) {
    return
  }

  if (source === 'click' && isEssentionalClick(options.refs, event.target as HTMLElement | null)) {
    return
  }

  options.onClose({ nativeEvent: event, source })
}

function onDocumentKeyUp(event: KeyboardEvent) {
  const key = event.key

  if (key !== 'Escape' && key !== 'Esc') {
    return
  }

  handleClose(event, 'esc')
}

function onDocumentPointerDown(event: PointerEvent) {
  eventTarget = event.target as HTMLElement
  activeOverlay = getTopOverlayOptions()

  handleClose(event, 'click', 'pressdown')
}

function onDocumentClick(event: MouseEvent) {
  const target = eventTarget
  eventTarget = null

  const currentActiveOverlay = activeOverlay
  activeOverlay = null

  if (event.button > 0) {
    return
  }

  // Проверяем, что слой тот же, что при `mousedown`,
  // иначе можем закрыть 2 слоя за одно нажатие
  if (currentActiveOverlay !== getTopOverlayOptions()) {
    return
  }

  // Убеждаемся, что элемент, который был нажат, совпадает с последним
  // при срабатывании события mousedown. Это предотвращает закрытие диалогового окна
  // перетаскиванием курсора (например, выделением текста внутри диалогового окна
  // и отпусканием мыши за его пределами).
  if (target !== event.target) {
    return
  }

  handleClose(event, 'click', 'pressup')
}

function attachEvents() {
  document.addEventListener('keyup', onDocumentKeyUp)
  document.addEventListener('pointerdown', onDocumentPointerDown, true)
  document.addEventListener('click', onDocumentClick, true)
}

function detachEvents() {
  document.removeEventListener('keyup', onDocumentKeyUp)
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  document.removeEventListener('click', onDocumentClick, true)
}

export const OverlayManager = Object.freeze({
  count(): number {
    return overlays.length
  },
  addOverlay(options: OverlayOptions): void {
    if (overlays.length === 0) {
      attachEvents()
    }
    overlays.push(options)
  },
  removeOverlay(options: OverlayOptions): void {
    overlays.splice(overlays.indexOf(options), 1)

    if (overlays.length === 0) {
      detachEvents()
    }
  },
  getTopOverlayOptions,
})
